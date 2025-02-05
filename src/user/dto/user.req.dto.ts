import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

import { SocialAuth } from '../enum/user.enum';

export class CheckNicknameDto {
  @ApiProperty({ description: '닉네임', example: '닉1' })
  @IsString()
  @IsNotEmpty()
  nickname: string;
}
export class CreateUserDto {
  @ApiProperty({ description: 'authId', example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  authId: string;

  @ApiProperty({ description: 'auth', example: 'google' })
  @IsString()
  @IsNotEmpty()
  auth: SocialAuth;

  @ApiProperty({ description: '이름', example: '김철수' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '이메일', example: 'test@test.com' })
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class UpdateNicknameDto {
  @ApiProperty({ description: '닉네임', example: '닉2' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 14)
  nickname: string;
}
