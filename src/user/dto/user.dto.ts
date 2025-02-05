import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { SocialAuth } from '../enum/user.enum';

@Exclude()
export class CheckNicknameDto {
  @ApiProperty({ example: true })
  @Expose()
  isExist: boolean;
}

@Exclude()
export class GetUserInfoDto {
  @ApiProperty({
    example: '1819acb8-9f95-4bb1-addd-b7d42f5e4ac2',
    description: '유저 인덱스',
    nullable: false,
    required: true,
  })
  @Expose()
  id: string;

  @ApiProperty({ description: 'auth', example: 'google' })
  @Expose()
  auth: SocialAuth;

  @ApiProperty({ description: '이름', example: '김철수' })
  @Expose()
  name: string;

  @ApiProperty({ description: '이메일', example: 'test@test.com' })
  @Expose()
  email: string;

  @ApiProperty({ description: '닉네임', example: '닉2' })
  @Expose()
  nickname: string;

  @ApiProperty({ description: '핸드폰 번호', example: '01012345678' })
  @Expose()
  phone: string;

  @ApiProperty({ description: '생성 일자', example: '2024-01-01T00:00:00.000Z' })
  @Expose()
  createdAt: Date;
}
