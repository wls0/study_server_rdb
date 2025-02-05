import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { FindFinancialTagsDto } from './financial-tag.dto';
import { ResponseDto } from '../../common/dto/common.res.dto';

export class FindFinancialTagsResDto extends ResponseDto {
  @ApiProperty({ type: FindFinancialTagsDto })
  @Type(() => FindFinancialTagsDto)
  body: FindFinancialTagsDto;
}
