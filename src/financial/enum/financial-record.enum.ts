export const FinancialRecordIncomeExpenseType = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

export type FinancialRecordIncomeExpenseType =
  (typeof FinancialRecordIncomeExpenseType)[keyof typeof FinancialRecordIncomeExpenseType];
