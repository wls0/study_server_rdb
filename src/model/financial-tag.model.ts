import { User } from './user.model';
import { IFinancialTag } from '../financial/interface/financial-tag.interface';
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

@Entity()
export class FinancialTag implements IFinancialTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'varchar' })
  @Index()
  userId: string;

  @Column({ nullable: false, type: 'varchar' })
  name: string;

  @Column({ nullable: false, type: 'varchar' })
  color: string;

  @Column({ default: false, type: 'boolean' })
  isIncome: boolean;

  @Column({ default: false, type: 'boolean' })
  isDeleted: boolean;

  @Column({ default: 0, type: 'int' })
  tagOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;
}
