import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SocialAuth } from '../user/enum/user.enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { IUser } from '../user/interfaces/user.interface';
import { FinancialPaymentSource } from './financial-payment-source.model';
import { FinancialTag } from './financial-tag.model';
import { FinancialRecord } from './financial-record.model';

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar' })
  @IsNotEmpty()
  @IsString()
  authId: string;

  @Column({ type: 'enum', enum: SocialAuth })
  @IsNotEmpty()
  @IsEnum(SocialAuth)
  auth: SocialAuth;

  @Column({ nullable: false, type: 'varchar' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @Column({ nullable: false, type: 'varchar' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column({ unique: true, type: 'varchar' })
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @Column({ default: '', type: 'varchar' })
  @IsString()
  phone: string;

  @Column({ nullable: true, type: 'varchar' })
  @IsString()
  fcmToken: string;

  @CreateDateColumn()
  @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  @Column({ default: null })
  @IsDate()
  @DeleteDateColumn()
  @IsOptional()
  deletedAt: Date | null;

  @OneToMany(() => FinancialPaymentSource, (financialPaymentSource) => financialPaymentSource.user)
  financialPaymentSources: FinancialPaymentSource[];

  @OneToMany(() => FinancialTag, (financialTag) => financialTag.user)
  financialTags: FinancialTag[];

  @OneToMany(() => FinancialRecord, (financialRecord) => financialRecord.user)
  financialRecords: FinancialRecord[];
}
