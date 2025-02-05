import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { FinancialRecordIncomeExpenseType } from '../enum/financial-record.enum';

export class CreateRecordReqDto {
  @ApiProperty({
    description: '수입/지출 타입',
    example: FinancialRecordIncomeExpenseType.INCOME,
    enum: FinancialRecordIncomeExpenseType,
  })
  @IsEnum(FinancialRecordIncomeExpenseType)
  @IsNotEmpty()
  incomeExpenseType: FinancialRecordIncomeExpenseType;

  @ApiProperty({
    description: '결제 수단 인덱스',
    example: '666408757ca7ce0026c74126',
    type: String,
  })
  @IsNotEmpty()
  paymentSourceId: number;

  @ApiProperty({ description: '태그 인덱스', example: '666408757ca7ce0026c74126', type: String })
  @IsNotEmpty()
  tagId: number;

  @ApiProperty({ description: '기록 제목', example: '오늘의 식비' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: '기록 금액', example: 10000 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: '기록 메모', example: '오늘 점심 식비' })
  @IsString()
  @IsOptional()
  memo: string;

  @ApiProperty({ description: '기록 날짜', example: '2024-01-01T00:00:00.000Z' })
  @IsDate()
  @IsNotEmpty()
  date: Date;
}

export class UpdateRecordReqDto {
  @ApiProperty({
    description: '기록 인덱스',
    example: '666408757ca7ce0026c74126',
    type: String,
  })
  @IsNotEmpty()
  recordId: number;

  @ApiProperty({
    description: '수입/지출 타입',
    example: FinancialRecordIncomeExpenseType.INCOME,
    enum: FinancialRecordIncomeExpenseType,
  })
  @IsEnum(FinancialRecordIncomeExpenseType)
  @IsNotEmpty()
  incomeExpenseType: FinancialRecordIncomeExpenseType;

  @ApiProperty({
    description: '결제 수단 인덱스',
    example: '666408757ca7ce0026c74126',
    type: String,
  })
  @IsNotEmpty()
  paymentSourceId: number;

  @ApiProperty({ description: '태그 인덱스', example: '666408757ca7ce0026c74126', type: String })
  @IsNotEmpty()
  tagId: number;

  @ApiProperty({ description: '기록 제목', example: '오늘의 식비' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: '기록 금액', example: 10000 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: '기록 메모', example: '오늘 점심 식비' })
  @IsString()
  @IsOptional()
  memo: string;

  @ApiProperty({ description: '기록 날짜', example: '2024-01-01T00:00:00.000Z' })
  @IsDate()
  @IsNotEmpty()
  date: Date;
}

export class DeleteRecordReqDto {
  @ApiProperty({
    description: '기록 인덱스',
    example: '666408757ca7ce0026c74126',
    type: String,
  })
  @IsNotEmpty()
  recordId: number;
}

export class FindRecordsByDateAndTagIdReqDto {
  @ApiProperty({ description: '태그 인덱스', example: '666408757ca7ce0026c74126', type: String })
  @IsNotEmpty()
  tagId: number;
}

export class FindRecordsByDateAndPaymentSourceIdReqDto {
  @ApiProperty({
    description: '결제 수단 인덱스',
    example: '666408757ca7ce0026c74126',
    type: String,
  })
  @IsNotEmpty()
  paymentSourceId: number;
}
