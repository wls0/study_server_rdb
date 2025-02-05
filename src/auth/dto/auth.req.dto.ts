import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { SocialAuth } from '../../user/enum/user.enum';

export class LoginReqDto {
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
