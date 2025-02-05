import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { AuthService } from './auth.service';
import { RefreshToken } from './decorators/auth.decorator';
import { LoginDto } from './dto/auth.dto';
import { LoginReqDto } from './dto/auth.req.dto';
import { LoginResDto } from './dto/auth.res.dto';
import { CurrentUser } from '../common/decorators/user.decorator';
import { JwtUserGuard } from '../common/jwt/jwt.guard';
import { IUser } from '../user/interfaces/user.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ status: 201, description: '로그인 성공', type: LoginResDto })
  @Post('/login')
  async login(@Body() body: LoginReqDto) {
    const result = await this.authService.login(body);
    return plainToInstance(LoginDto, result);
  }

  @ApiOperation({ summary: '토큰 재발급' })
  @ApiResponse({ status: 201, description: '토큰 재발급 성공', type: LoginResDto })
  @Post('/refresh')
  async refresh(@RefreshToken() token: string) {
    const result = await this.authService.refresh(token);
    return plainToInstance(LoginDto, result);
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  @UseGuards(JwtUserGuard)
  @Delete('/logout')
  async logout(@CurrentUser() user: IUser) {
    const { id } = user;
    await this.authService.logout(id);
    return;
  }

  @ApiOperation({ summary: '회원탈퇴' })
  @ApiResponse({ status: 200, description: '회원탈퇴 성공' })
  @UseGuards(JwtUserGuard)
  @Delete('/signout')
  async signout(@CurrentUser() user: IUser) {
    const { id } = user;
    await this.authService.signout(id);
    return;
  }
}
