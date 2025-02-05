import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { PaymentSourceType } from '../enum/financial-payment-source.enum';

@Exclude()
class PaymentSource {
  @ApiProperty({ example: '666408757ca7ce0026c74126', required: true })
  @Expose()
  _id: string;

  @ApiProperty({ example: '166408757ca7ce0026c74126', required: true })
  @Expose()
  userId: string;

  @ApiProperty({
    example: PaymentSourceType.CARD,
    enum: PaymentSourceType,
    type: String,
    required: true,
  })
  @Expose()
  paymentType: PaymentSourceType;

  @ApiProperty({ example: '삼성', required: true })
  @Expose()
  companyType: string;

  @ApiProperty({ example: '1234', required: false })
  @Expose()
  specialIdentifier: string;

  @ApiProperty({ example: false, required: true })
  @Expose()
  isDeleted: boolean;

  @ApiProperty({ example: 1, required: true })
  @Expose()
  paymenySourceOrder: number;
}

export class FindPaymentSourceListDto {
  @ApiProperty({ type: [PaymentSource] })
  paymentSources: PaymentSource[];
}
