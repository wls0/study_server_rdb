import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { PaymentSourceType } from '../enum/financial-payment-source.enum';
import { FinancialRecordIncomeExpenseType } from '../enum/financial-record.enum';

@Exclude()
class FinancialRecords {
  @ApiProperty({ example: '666408757ca7ce0026c74126', required: true })
  @Expose()
  _id: string;

  @ApiProperty({ example: '166408757ca7ce0026c74126', required: true })
  @Expose()
  userId: string;

  @ApiProperty({
    example: FinancialRecordIncomeExpenseType.INCOME,
    enum: FinancialRecordIncomeExpenseType,
    type: String,
    required: true,
  })
  @Expose()
  incomeExpenseType: FinancialRecordIncomeExpenseType;

  @ApiProperty({ example: '666408757ca7ce0026c74126', required: true })
  @Expose()
  paymentSourceId: string;

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

  @ApiProperty({ example: '666408757ca7ce0026c74126', required: true })
  @Expose()
  tagId: string;

  @ApiProperty({ example: '666408757ca7ce0026c74126', required: true })
  @Expose()
  tagName: string;

  @ApiProperty({ example: '#000000', required: true })
  @Expose()
  tagColor: string;

  @ApiProperty({ example: '오늘 점심', required: true })
  @Expose()
  title: string;

  @ApiProperty({ example: '2024-01-01', required: true })
  @Expose()
  amount: number;

  @ApiProperty({ example: '', required: true })
  @Expose()
  memo: string;

  @ApiProperty({ example: '2024-03-01T00:00:00.000Z', required: true })
  @Expose()
  date: Date;
}

export class FindFinancialRecordsDto {
  @ApiProperty({ description: '기록 리스트', type: [FinancialRecords] })
  @Type(() => FinancialRecords)
  records: FinancialRecords[];
}

export class FindCalendarRecord {
  @ApiProperty({ description: '날짜', example: '2024-01-01' })
  @Expose()
  date: string;

  @ApiProperty({ description: '수입 금액', example: 10000 })
  @Expose()
  income: number;

  @ApiProperty({ description: '지출 금액', example: 10000 })
  @Expose()
  expense: number;
}

export class FindCalendarRecordDto {
  @ApiProperty({ description: '한 달간 사용 금액 내역', type: [FindCalendarRecord] })
  @Type(() => FindCalendarRecord)
  calendarData: FindCalendarRecord[];
}

@Exclude()
class FindRecordReportTagByDate {
  @ApiProperty({ description: '태그 인덱스', example: '67066de1a9632228c84c0655' })
  @Expose()
  @Type(() => String)
  _id: string;

  @ApiProperty({ description: '태그 이름', example: '식비' })
  @Expose()
  name: string;

  @ApiProperty({ description: '태그 색상', example: 'FFFFB3BA' })
  @Expose()
  color: string;

  @ApiProperty({ description: '태그 별 총 금액', example: 10000 })
  @Expose()
  totalAmount: number;
}
@Exclude()
class FindRecordReportPaymentSourceByDate {
  @ApiProperty({ description: '결제 수단 인덱스', example: '67066de1a9632228c84c0655' })
  @Expose()
  @Type(() => String)
  _id: string;

  @ApiProperty({
    description: '결제 수단 타입',
    type: String,
    example: PaymentSourceType.CARD,
    enum: PaymentSourceType,
  })
  @Expose()
  paymentType: PaymentSourceType;

  @ApiProperty({ description: '회사 타입', example: '삼성' })
  @Expose()
  companyType: string;

  @ApiProperty({ description: '특정 식별자', example: '1234' })
  @Expose()
  specialIdentifier: string;

  @ApiProperty({ description: '결제 수단 별 총 금액', example: 10000 })
  @Expose()
  totalAmount: number;
}

@Exclude()
class FindRecordReportDailyExpense {
  @ApiProperty({ description: '날짜', example: '2024-01-01' })
  @Expose()
  date: string;

  @ApiProperty({ description: '일일 지출 합계', example: 10000 })
  @Expose()
  totalAmount: number;
}

@Exclude()
class FindRecordReportDayOfWeekExpense {
  @ApiProperty({ description: '요일', example: 1 })
  @Expose()
  day: number;

  @ApiProperty({ description: '주간 지출 합계', example: 10000 })
  @Expose()
  totalAmount: number;

  @ApiProperty({ description: '주간 횟수 합계', example: 4 })
  @Expose()
  usedTotalCount: number;
}

@Exclude()
export class FindRecordReportsByDateDto {
  @ApiProperty({ description: '태그 별 총 금액', type: [FindRecordReportTagByDate] })
  @Type(() => FindRecordReportTagByDate)
  @Expose()
  tags: FindRecordReportTagByDate[];

  @ApiProperty({ description: '결제 수단 별 총 금액', type: [FindRecordReportPaymentSourceByDate] })
  @Type(() => FindRecordReportPaymentSourceByDate)
  @Expose()
  paymentSources: FindRecordReportPaymentSourceByDate[];

  @ApiProperty({ description: '일일 지출 합계', type: [FindRecordReportDailyExpense] })
  @Type(() => FindRecordReportDailyExpense)
  @Expose()
  spendingTrend: FindRecordReportDailyExpense[];

  @ApiProperty({ description: '요일 별 지출 합계', type: [FindRecordReportDayOfWeekExpense] })
  @Type(() => FindRecordReportDayOfWeekExpense)
  @Expose()
  dayOfWeekExpenses: FindRecordReportDayOfWeekExpense[];

  @ApiProperty({ description: '총 수입 합계', example: 10000 })
  @Expose()
  totalIncome: number;

  @ApiProperty({ description: '총 지출 합계', example: 10000 })
  @Expose()
  totalExpense: number;
}
