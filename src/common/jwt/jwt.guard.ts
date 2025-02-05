import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * 일반 유저 토큰 검증
 */
@Injectable()
export class JwtUserGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(err: any, user: any, info: any): TUser {
    if (info) {
      throw new UnauthorizedException(info?.message);
    }
    if (!user) {
      throw err;
    }
    return user;
  }
}
