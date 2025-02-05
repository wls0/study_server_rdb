import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../model/user.model';
import { UserRepository } from './repositories/user.repository';
import { FinancialModule } from 'src/financial/financial.module';
import { FinancialPaymentSource } from '../model/financial-payment-source.model';
import { FinancialRecord } from '../model/financial-record.model';
import { FinancialTag } from '../model/financial-tag.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, FinancialPaymentSource, FinancialRecord, FinancialTag]),
    FinancialModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
