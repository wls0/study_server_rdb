import { Module } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { FinancialPaymentSource } from 'src/model/financial-payment-source.model';
import { FinancialRecord } from 'src/model/financial-record.model';
import { FinancialTag } from 'src/model/financial-tag.model';
import { FinancialPaymentSourceModule } from './payment-source/financial-payment-source.module';
import { FinancialRecordModule } from './record/financial-record.module';
import { FinancialPaymentSourceRepository } from './repositories/financial-payment-source.repository';
import { FinancialRecordRepository } from './repositories/financial-record.repository';
import { FinancialTagRepository } from './repositories/financial-tag.repository';
import { FinancialTagModule } from './tag/financial-tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    FinancialTagModule,
    FinancialPaymentSourceModule,
    FinancialRecordModule,
    TypeOrmModule.forFeature([FinancialTag, FinancialRecord, FinancialPaymentSource]),
  ],
  providers: [
    FinancialService,
    FinancialTagRepository,
    FinancialPaymentSourceRepository,
    FinancialRecordRepository,
  ],
  exports: [FinancialService],
})
export class FinancialModule {}
