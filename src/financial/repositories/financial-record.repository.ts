import { Injectable } from '@nestjs/common';

import { FinancialRecord } from '../../model/financial-record.model';
import { IUpdateRecordsPaymentByPaymentId } from '../interface/financial-payment-source.interface';
import {
  ICreateRecord,
  IDeleteRecord,
  IFindLatestRecords,
  IFindRecordsByDate,
  IFindRecordsByDateAndPaymentSourceId,
  IFindRecordsByDateAndTagId,
  IUpdateRecord,
} from '../interface/financial-record.interface';
import { IUpdateRecordsTagByTagId } from '../interface/financial-tag.interface';
import { InjectRepository } from '@nestjs/typeorm';
import {
  And,
  Between,
  EntityManager,
  IsNull,
  LessThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { FinancialRecordIncomeExpenseType } from '../enum/financial-record.enum';

@Injectable()
export class FinancialRecordRepository {
  constructor(
    @InjectRepository(FinancialRecord) private financialRecordModel: Repository<FinancialRecord>,
  ) {}

  /**
   * 기록 생성
   * @param ICreateRecord
   * @returns
   */
  async createRecord(dto: ICreateRecord) {
    return await this.financialRecordModel.save(dto);
  }

  /**
   * 기록 업데이트
   * @param IUpdateRecord 기록 업데이트 요청 데이터
   * @returns 기록 업데이트 결과
   */
  async updateRecord(dto: IUpdateRecord) {
    const { recordId, userId } = dto;

    return await this.financialRecordModel.update({ id: recordId, userId }, dto);
  }

  /**
   * 기록 삭제
   * @param IDeleteRecord 기록 삭제 요청 데이터
   * @returns 기록 삭제 결과
   */
  async deleteRecord(dto: IDeleteRecord) {
    const { recordId, userId } = dto;

    return await this.financialRecordModel.softDelete({
      id: recordId,
      userId,
      deletedAt: IsNull(),
    });
  }

  /**
   * 최근 기록 리스트 조회
   * @param IFindLatestRecords
   * @returns
   */
  async findLatestRecords(dto: IFindLatestRecords) {
    const { userId, skip, limit } = dto;

    return await this.financialRecordModel.find({
      where: { userId, deletedAt: IsNull() },
      order: { date: 'DESC', id: 'DESC' },
      relations: ['tag', 'paymentSource'],
      skip,
      take: limit,
    });
  }

  /**
   * 날짜 별 기록 리스트 조회
   * @param IFindRecordByDate
   * @returns
   */
  async findRecordsByDate(dto: IFindRecordsByDate) {
    const { userId, startDate, endDate } = dto;
    return await this.financialRecordModel.find({
      where: {
        userId,
        date: And(MoreThanOrEqual(startDate), LessThan(endDate)),
        deletedAt: IsNull(),
      },
      order: { date: 'ASC', id: 'DESC' },
    });
  }

  /**
   * 날짜 별 상세 기록 리스트 조회
   * @param IFindRecordByDate
   * @returns
   */
  async findRecordsDetailByDate(dto: IFindRecordsByDate) {
    const { userId, startDate, endDate } = dto;

    return await this.financialRecordModel.find({
      where: {
        userId,
        date: And(MoreThanOrEqual(startDate), LessThan(endDate)),
        deletedAt: IsNull(),
      },
      order: { date: 'ASC', id: 'DESC' },
      relations: ['tag', 'paymentSource'],
    });
  }

  /**
   * 수입 합계
   * @param IFindRecordsByDate
   */
  async findRecordIncomeReportsByDate(dto: IFindRecordsByDate) {
    const { userId, startDate, endDate } = dto;

    return await this.financialRecordModel.sum('amount', {
      userId,
      date: And(MoreThanOrEqual(startDate), LessThan(endDate)),
      incomeExpenseType: FinancialRecordIncomeExpenseType.INCOME,
      deletedAt: IsNull(),
    });
  }
  /**
   * 지출 합계
   * @param IFindRecordsByDate
   */
  async findRecordExpenseReportsByDate(dto: IFindRecordsByDate) {
    const { userId, startDate, endDate } = dto;

    return await this.financialRecordModel.sum('amount', {
      userId,
      date: And(MoreThanOrEqual(startDate), LessThan(endDate)),
      incomeExpenseType: FinancialRecordIncomeExpenseType.EXPENSE,
      deletedAt: IsNull(),
    });
  }
  /**
   * 태그 별 지출 합계
   * @param IFindRecordsByDate
   * @returns
   */
  async findRecordExpenseTagReportsByDate(dto: IFindRecordsByDate) {
    const { userId, startDate, endDate } = dto;

    return await this.financialRecordModel
      .createQueryBuilder('record')
      .where('record.userId = :userId', { userId: userId })
      .andWhere('record.date >= :startDate', { startDate })
      .andWhere('record.date < :endDate', { endDate })
      .andWhere('record.incomeExpenseType = :incomeExpenseType', { incomeExpenseType: 'expense' })
      .addSelect('SUM(record.amount)', 'totalAmount')
      .groupBy('record.tagId')
      .getMany();
  }

  /**
   * 결제 수단 별 지출 합계
   * @param IFindRecordsByDate
   * @returns
   */
  async findRecordExpensePaymentSourceReportsByDate(dto: IFindRecordsByDate) {
    const { userId, startDate, endDate } = dto;

    return await this.financialRecordModel
      .createQueryBuilder('record')
      .where('record.userId = :userId', { userId: userId })
      .andWhere('record.date >= :startDate', { startDate })
      .andWhere('record.date < :endDate', { endDate })
      .andWhere('record.incomeExpenseType = :incomeExpenseType', { incomeExpenseType: 'expense' })
      .addSelect('SUM(record.amount)', 'totalAmount')
      .groupBy('record.paymentSourceId')
      .getMany();
  }

  /**
   * 요일 별 지출 내역
   * @param IFindRecordsByDate
   * @returns
   */
  async findRecordExpenseDayOfWeekExpensesReportsByDate(dto: IFindRecordsByDate) {
    const { userId, startDate, endDate } = dto;
    return await this.financialRecordModel
      .createQueryBuilder('record')
      .where('record.userId = :userId', { userId: userId })
      .andWhere('record.date >= :startDate', { startDate })
      .andWhere('record.date < :endDate', { endDate })
      .andWhere('record.incomeExpenseType = :incomeExpenseType', { incomeExpenseType: 'expense' });
  }

  /**
   * 날짜 별 지출 합계 내역
   * @param IFindRecordsByDate
   */
  async findRecordExpenseSpendingTrendReportsByDate(dto: IFindRecordsByDate) {
    const { userId, startDate, endDate } = dto;

    return await this.financialRecordModel
      .createQueryBuilder('record')
      .where('record.userId = :userId', { userId: userId })
      .andWhere('record.date >= :startDate', { startDate })
      .andWhere('record.date < :endDate', { endDate })
      .andWhere('record.incomeExpenseType = :incomeExpenseType', { incomeExpenseType: 'expense' })
      .select("DAYOFWEEK(CONVERT_TZ(record.date, '+00:00', '+09:00'))", 'dayOfWeek')
      .addSelect("DATE_FORMAT(CONVERT_TZ(record.date, '+00:00', '+09:00'), '%W')", 'dayName')
      .addSelect('record.amount', 'totalAmount')
      .groupBy("DAYOFWEEK(CONVERT_TZ(record.date, '+00:00', '+09:00'))")
      .getMany();
  }

  /**
   * 결제 수단 ID로 기록 결제 수단 업데이트
   * @param paymentId
   * @returns
   */
  async updateRecordsPaymentByPaymentId(
    paymentIds: IUpdateRecordsPaymentByPaymentId,
    session?: EntityManager,
  ) {
    const { beforPaymentSourceId, afterPaymentSourceId } = paymentIds;
    const model = session ? session.getRepository(FinancialRecord) : this.financialRecordModel;
    return await model.update(
      { paymentSourceId: beforPaymentSourceId },
      { paymentSourceId: afterPaymentSourceId },
    );
  }

  /**
   * 태그 ID로 기록 태그 업데이트
   * @param tagId
   * @returns
   */
  async updateRecordsTagByTagId(tagIds: IUpdateRecordsTagByTagId, session?: EntityManager) {
    const { beforTagId, afterTagId } = tagIds;
    const model = session ? session.getRepository(FinancialRecord) : this.financialRecordModel;
    return await model.update({ tagId: beforTagId }, { tagId: afterTagId });
  }

  /**
   * 기록 전체 삭제
   * @param userId
   * @returns
   */
  async deleteUserTotalTagByUserId(userId: string, session?: EntityManager) {
    const model = session ? session.getRepository(FinancialRecord) : this.financialRecordModel;
    return await model.softDelete({ userId, deletedAt: IsNull() });
  }

  /**
   * 날짜 별 특정 태그 기록 리스트 조회
   * @param IFindRecordByDate
   * @returns
   */
  async findRecordsByDateAndTagId(dto: IFindRecordsByDateAndTagId) {
    const { userId, tagId, startDate, endDate, skip, limit } = dto;

    return await this.financialRecordModel.find({
      where: {
        userId,
        tagId,
        date: And(MoreThanOrEqual(startDate), LessThan(endDate)),
        deletedAt: IsNull(),
      },
      order: { date: 'DESC', id: 'DESC' },
      relations: ['tag', 'paymentSource'],
      skip,
      take: limit,
    });
  }

  /**
   * 날짜 별 특정 결제 수단 기록 리스트 조회
   * @param IFindRecordByDate
   * @returns
   */
  async findRecordsByDateAndPaymentSourceId(dto: IFindRecordsByDateAndPaymentSourceId) {
    const { userId, paymentSourceId, startDate, endDate, skip, limit } = dto;
    return await this.financialRecordModel.find({
      where: {
        userId,
        paymentSourceId,
        date: And(MoreThanOrEqual(startDate), LessThan(endDate)),
        deletedAt: IsNull(),
      },
      order: { date: 'DESC', id: 'DESC' },
      relations: ['tag', 'paymentSource'],
      skip,
      take: limit,
    });
  }
}
