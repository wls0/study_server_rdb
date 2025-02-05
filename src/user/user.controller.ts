import { Controller, Get, Param, Body, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { GetUserInfoDto } from './dto/user.dto';
import { CheckNicknameDto, UpdateNicknameDto } from './dto/user.req.dto';
import { CheckNicknameResDto, GetUserInfoResDto } from './dto/user.res.dto';
import { IUser } from './interfaces/user.interface';
import { UserService } from './user.service';
import { CurrentUser } from '../common/decorators/user.decorator';
import { ResponseDto } from '../common/dto/common.res.dto';
import { JwtUserGuard } from '../common/jwt/jwt.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '닉네임 확인' })
  @ApiResponse({ status: 200, description: '닉네임 확인', type: CheckNicknameResDto })
  @Get('/nickname/:nickname')
  async checkNickname(@Param() param: CheckNicknameDto) {
    const result = await this.userService.checkNickname(param);
    return plainToInstance(CheckNicknameDto, result);
  }

  @ApiOperation({ summary: '닉네임 수정' })
  @ApiResponse({ status: 200, description: '닉네임 수정 성공', type: ResponseDto })
  @UseGuards(JwtUserGuard)
  @ApiBearerAuth()
  @Patch('/nickname')
  async updateNickname(@CurrentUser() user: IUser, @Body() body: UpdateNicknameDto) {
    const id = user.id;
    return await this.userService.updateNickname(id, body);
  }

  @ApiOperation({ summary: '유저 본인 정보 조회' })
  @ApiResponse({ status: 200, description: '유저 본인 정보 조회 성공', type: GetUserInfoResDto })
  @UseGuards(JwtUserGuard)
  @ApiBearerAuth()
  @Get('/info')
  async getUserInfo(@CurrentUser() user: IUser) {
    const result = await this.userService.getUserInfo(user);
    return plainToInstance(GetUserInfoDto, result);
  }
}
