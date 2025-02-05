import { ApiProperty } from '@nestjs/swagger';

import { CheckNicknameDto, GetUserInfoDto } from './user.dto';
import { ResponseDto } from '../../common/dto/common.res.dto';

export class CheckNicknameResDto extends ResponseDto {
  @ApiProperty({ type: CheckNicknameDto })
  body: CheckNicknameDto;
}

export class GetUserInfoResDto extends ResponseDto {
  @ApiProperty({ description: '유저 아이디', type: GetUserInfoDto })
  body: GetUserInfoDto;
}
