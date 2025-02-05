import { PaymentSourceType } from '../enum/financial-payment-source.enum';

export interface IFinancialPaymentSource {
  id: number;
  userId: string;
  paymentType: PaymentSourceType;
  companyType: string;
  specialIdentifier: string;
  isDeleted: boolean;
  paymentSourceOrder: number;
  createdAt: Date;
  deletedAt: Date | null;
}

export interface IFindPaymentSource {
  userId: string;
  paymentType: PaymentSourceType;
  companyType: string;
  specialIdentifier: string;
}

export interface ICreatePaymentSource {
  userId: string;
  paymentType: PaymentSourceType;
  companyType: string;
  specialIdentifier?: string;
  isDeleted?: boolean;
  paymentSourceOrder: number;
}

export interface IUpdatePaymentSourceByIdAndUserId {
  paymentSourceId: number;
  userId: string;
  paymentType: PaymentSourceType;
  companyType: string;
  specialIdentifier?: string;
}
export interface IDeletePaymentSource {
  paymentSourceId: number;
  userId: string;
}

export interface IUpdateRecordsPaymentByPaymentId {
  beforPaymentSourceId: number;
  afterPaymentSourceId: number;
}

export interface IUpdatePaymentSourceOrderByPaymentSourceId {
  paymentSourceId: number;
  paymentSourceOrder: number;
}
