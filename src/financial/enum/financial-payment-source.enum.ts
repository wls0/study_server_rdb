export const PaymentSourceType = {
  CARD: 'card',
  BANK: 'bank',
  CASH: 'cash',
  DELETE: 'delete',
} as const;

export type PaymentSourceType = (typeof PaymentSourceType)[keyof typeof PaymentSourceType];
