export interface IFinancialTag {
  id: number;
  userId: string;
  name: string;
  color: string;
  isIncome: boolean;
  isDeleted: boolean;
  tagOrder: number;
  createdAt: Date;
  deletedAt: Date | null;
}

export interface ICreateTag {
  userId: string;
  name: string;
  color: string;
  isIncome?: boolean;
  isDeleted?: boolean;
  tagOrder: number;
}

export interface IFindTagByUserIdAndName {
  userId: string;
  name: string;
}

export interface IUpdateTag {
  userId: string;
  tagId: number;
  name: string;
  color: string;
}
export interface IDeleteTagByUserIdAndTagId {
  userId: string;
  tagId: number;
}

export interface IUpdateRecordsTagByTagId {
  beforTagId: number;
  afterTagId: number;
}

export interface IUpdateTagOrderByTagId {
  tagId: number;
  tagOrder: number;
}
