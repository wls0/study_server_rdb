import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { LoginReqDto } from './dto/auth.req.dto';
import { AuthRepository } from './repositories/auth.repository';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
  ) {}

  /** 로그인
   * @param LoginReqDto
   * @returns
   */
  async login(body: LoginReqDto) {
    const { authId, auth } = body;

    let id = '';
    const user = await this.userService.getUserByAuthIdAndAuth(authId, auth);
    if (user) {
      id = user.id.toString();
    } else {
      const newUser = await this.userService.createUser(body);
      id = newUser.toString();
    }

    const refreshToken = this.jwtService.sign(
      {
        id,
      },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: 10 * 60,
      },
    );
    await this.authRepository.deleteToken(id);
    await this.authRepository.createRefreshToken({
      userId: id,
      refreshToken,
    });

    const accessToken = this.jwtService.sign(
      { id },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: 14 * 24 * 60 * 60,
      },
    );
    return { accessToken, refreshToken };
  }

  /** 리프레시
   * @param token
   * @returns
   */
  async refresh(token: string) {
    try {
      const verifyRefreshToken = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      const userId: string = verifyRefreshToken.id;

      await this.authRepository.deleteToken(userId);

      const accessToken = this.jwtService.sign(
        { id: verifyRefreshToken.id },
        { secret: this.configService.get('JWT_SECRET'), expiresIn: 10 * 60 },
      );
      const refreshToken = this.jwtService.sign(
        { id: verifyRefreshToken.id },
        { secret: this.configService.get('JWT_SECRET'), expiresIn: 14 * 24 * 60 * 60 },
      );

      await this.authRepository.createRefreshToken({
        userId,
        refreshToken: refreshToken,
      });
      return { accessToken, refreshToken };
    } catch (err) {
      switch (err.message) {
        case 'jwt expired':
          const decodeToken = this.jwtService.decode(token);
          await this.authRepository.deleteToken(decodeToken.id);
          throw new UnauthorizedException({
            message: err.message,
            error: 'REFRESH_TOKEN_EXPIRED',
            statusCode: 401,
          });
        case 'invalid token':
        case 'jwt malformed':
        case 'jwt signature is required':
        case 'invalid signature':
          throw new UnauthorizedException(err.message);
      }
    }
  }

  /** 로그아웃
   * @param token
   */
  async logout(userId: string) {
    await this.authRepository.deleteToken(userId);
    return;
  }

  /** 회원탈퇴
   * @param userId
   * @returns
   */
  async signout(userId: string) {
    await this.userService.deleteUser(userId);
    await this.authRepository.deleteToken(userId);
    return;
  }
}
