import { Module } from '@nestjs/common';

import { FinancialPaymentSourceController } from './financial-payment-source.controller';
import { FinancialPaymentSourceService } from './financial-payment-source.service';
import { FinancialPaymentSource } from '../../model/financial-payment-source.model';
import { FinancialRecord } from '../../model/financial-record.model';
import { FinancialPaymentSourceRepository } from '../repositories/financial-payment-source.repository';
import { FinancialRecordRepository } from '../repositories/financial-record.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([FinancialRecord, FinancialPaymentSource])],
  controllers: [FinancialPaymentSourceController],
  providers: [
    FinancialPaymentSourceService,
    FinancialPaymentSourceRepository,
    FinancialRecordRepository,
  ],
})
export class FinancialPaymentSourceModule {}
