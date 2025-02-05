import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { FindPaymentSourceListDto } from './financial-payment-source.dto';
import { ResponseDto } from '../../common/dto/common.res.dto';

export class FindPaymentSourceListResDto extends ResponseDto {
  @ApiProperty({ type: FindPaymentSourceListDto })
  @Type(() => FindPaymentSourceListDto)
  body: FindPaymentSourceListDto;
}
