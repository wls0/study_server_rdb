import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { PaymentSourceType } from '../enum/financial-payment-source.enum';

export class CreatePaymentSourceReqDto {
  @ApiProperty({ example: '카드', description: '결제 수단 이름', enum: PaymentSourceType })
  @IsEnum(PaymentSourceType)
  @IsNotEmpty()
  paymentType: PaymentSourceType;

  @ApiProperty({ example: '삼성', description: '회사 이름' })
  @IsString()
  @IsNotEmpty()
  companyType: string;

  @ApiProperty({ example: '1234', description: '특별 식별자' })
  @IsString()
  @IsOptional()
  specialIdentifier?: string;
}

export class UpdatePaymentSourceReqDto {
  @ApiProperty({ example: '666408757ca7ce0026c74126', description: '유저 ID', type: String })
  @IsNotEmpty()
  paymentSourceId: number;

  @ApiProperty({ example: '카드', description: '결제 수단 이름', enum: PaymentSourceType })
  @IsEnum(PaymentSourceType)
  @IsNotEmpty()
  paymentType: PaymentSourceType;

  @ApiProperty({ example: '삼성', description: '회사 이름' })
  @IsString()
  @IsNotEmpty()
  companyType: string;

  @ApiProperty({ example: '1234', description: '특별 식별자' })
  @IsString()
  @IsOptional()
  specialIdentifier?: string;
}

export class DeletePaymentSourceReqDto {
  @ApiProperty({ example: '666408757ca7ce0026c74126', description: '결제 수단 ID', type: String })
  @IsNotEmpty()
  paymentSourceId: number;
}

export class UpdatePaymentSourceOrderReqDto {
  @IsNotEmpty()
  @IsArray()
  paymentSourceIds: number[];
}
