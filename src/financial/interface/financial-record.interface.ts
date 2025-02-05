import { FinancialRecordIncomeExpenseType } from '../enum/financial-record.enum';

export interface IFinancialRecord {
  id: number;
  userId: string;
  incomeExpenseType: FinancialRecordIncomeExpenseType;
  paymentSourceId: number;
  tagId: number;
  title: string;
  amount: number;
  memo: string;
  date: Date;
  createdAt: Date;
  deletedAt: Date | null;
}

export interface ICreateRecord {
  userId: string;
  incomeExpenseType: FinancialRecordIncomeExpenseType;
  paymentSourceId: number;
  tagId: number;
  title: string;
  amount: number;
  memo: string;
  date: Date;
}

export interface IUpdateRecord {
  recordId: number;
  userId: string;
  incomeExpenseType: FinancialRecordIncomeExpenseType;
  paymentSourceId: number;
  tagId: number;
  title: string;
  amount: number;
  memo: string;
  date: Date;
}

export interface IDeleteRecord {
  recordId: number;
  userId: string;
}

export interface IFindLatestRecords {
  userId: string;
  skip: number;
  limit: number;
}

export interface IFindRecordsByDate {
  userId: string;
  startDate: Date;
  endDate: Date;
}

export interface IFindRecordsByDateAndTagId {
  userId: string;
  tagId: number;
  startDate: Date;
  endDate: Date;
  skip: number;
  limit: number;
}

export interface IFindRecordsByDateAndPaymentSourceId {
  userId: string;
  paymentSourceId: number;
  startDate: Date;
  endDate: Date;
  skip: number;
  limit: number;
}
