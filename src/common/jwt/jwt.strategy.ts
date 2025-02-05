import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { IJwtPayload } from './jwt.interface';
import { JwtService } from './jwt.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET') as string,
      ignoreExpiration: false,
    });
  }

  async validate(payload: IJwtPayload) {
    const { id } = payload;

    try {
      if (id) {
        const userId = id;
        const user = await this.jwtService.getUser(userId);

        return user;
      } else {
        throw new ForbiddenException('wrong token');
      }
    } catch (err) {
      throw new UnauthorizedException({ message: err.message });
    }
  }
}
