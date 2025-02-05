import { User } from './user.model';
import { PaymentSourceType } from '../financial/enum/financial-payment-source.enum';
import { IFinancialPaymentSource } from '../financial/interface/financial-payment-source.interface';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

@Entity()
export class FinancialPaymentSource implements IFinancialPaymentSource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'varchar' })
  @Index()
  userId: string;

  @Column({ type: 'enum', enum: PaymentSourceType })
  @IsEnum(PaymentSourceType)
  paymentType: PaymentSourceType;

  @Column({ nullable: false, type: 'varchar' })
  companyType: string;

  @Column({ default: '', type: 'varchar' })
  @IsNotEmpty()
  @IsString()
  specialIdentifier: string;

  @Column({ default: false, type: 'boolean' })
  isDeleted: boolean;

  @Column({ default: 0, type: 'int' })
  paymentSourceOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;
}
