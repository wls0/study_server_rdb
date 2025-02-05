import { Module } from '@nestjs/common';
import { FinancialTagController } from './financial-tag.controller';
import { FinancialTagService } from './financial-tag.service';
import { FinancialRecord } from '../../model/financial-record.model';
import { FinancialTag } from '../../model/financial-tag.model';
import { FinancialRecordRepository } from '../repositories/financial-record.repository';
import { FinancialTagRepository } from '../repositories/financial-tag.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([FinancialTag, FinancialRecord])],
  controllers: [FinancialTagController],
  providers: [FinancialTagService, FinancialTagRepository, FinancialRecordRepository],
})
export class FinancialTagModule {}
