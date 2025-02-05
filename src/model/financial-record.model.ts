import { FinancialPaymentSource } from './financial-payment-source.model';
import { FinancialTag } from './financial-tag.model';
import { User } from './user.model';
import { FinancialRecordIncomeExpenseType } from '../financial/enum/financial-record.enum';
import { IFinancialRecord } from '../financial/interface/financial-record.interface';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { IsEnum } from 'class-validator';

@Entity()
export class FinancialRecord implements IFinancialRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @RelationId((record: FinancialRecord) => record.user)
  userId: string;

  @Column({ type: 'enum', enum: FinancialRecordIncomeExpenseType })
  @IsEnum(FinancialRecordIncomeExpenseType)
  incomeExpenseType: FinancialRecordIncomeExpenseType;

  @Column({ nullable: false, type: 'int' })
  paymentSourceId: number;

  @Column({ nullable: false, type: 'int' })
  tagId: number;

  @Column({ nullable: false, type: 'varchar' })
  title: string;

  @Column({ nullable: false, type: 'int' })
  amount: number;

  @Column({ type: 'text' })
  memo: string;

  @Column({ nullable: false, type: 'datetime' })
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => FinancialTag, (tag) => tag.id)
  @JoinColumn({ name: 'tagId' })
  tag: FinancialTag;

  @OneToOne(() => FinancialPaymentSource, (paymentSource) => paymentSource.id)
  @JoinColumn({ name: 'paymentSourceId' })
  paymentSource: FinancialPaymentSource;
}
