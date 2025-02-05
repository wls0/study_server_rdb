import { Module } from '@nestjs/common';

import { FinancialRecordController } from './financial-record.controller';
import { FinancialRecordService } from './financial-record.service';
import { FinancialPaymentSource } from '../../model/financial-payment-source.model';
import { FinancialRecord } from '../../model/financial-record.model';
import { FinancialTag } from '../../model/financial-tag.model';
import { FinancialPaymentSourceRepository } from '../repositories/financial-payment-source.repository';
import { FinancialRecordRepository } from '../repositories/financial-record.repository';
import { FinancialTagRepository } from '../repositories/financial-tag.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([FinancialRecord, FinancialTag, FinancialPaymentSource])],
  controllers: [FinancialRecordController],
  providers: [
    FinancialRecordService,
    FinancialRecordRepository,
    FinancialTagRepository,
    FinancialPaymentSourceRepository,
  ],
})
export class FinancialRecordModule {}
