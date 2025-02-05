import { Injectable, NotFoundException } from '@nestjs/common';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import {
  PaginatedDateSearchDto,
  PaginationDto,
  SearchDateIntervalDto,
} from '../../common/dto/common.req.dto';
import { FindCalendarRecord } from '../dto/financial-record.dto';
import {
  CreateRecordReqDto,
  DeleteRecordReqDto,
  FindRecordsByDateAndPaymentSourceIdReqDto,
  FindRecordsByDateAndTagIdReqDto,
  UpdateRecordReqDto,
} from '../dto/financial-record.req.dto';
import { FinancialRecordIncomeExpenseType } from '../enum/financial-record.enum';
import { FinancialPaymentSourceRepository } from '../repositories/financial-payment-source.repository';
import { FinancialRecordRepository } from '../repositories/financial-record.repository';
import { FinancialTagRepository } from '../repositories/financial-tag.repository';

dayjs.extend(utc);
dayjs.extend(timezone);
@Injectable()
export class FinancialRecordService {
  constructor(
    private readonly financialRecordRepository: FinancialRecordRepository,
    private readonly financialTagRepository: FinancialTagRepository,
    private readonly financialPaymentSourceRepository: FinancialPaymentSourceRepository,
  ) {}

  /**
   * 기록 생성
   * @param userId 유저 인덱스
   * @param CreateRecordReqDto 기록 생성 요청 데이터
   * @returns 기록 생성 결과
   */
  async createRecord(userId: string, body: CreateRecordReqDto) {
    return await this.financialRecordRepository.createRecord({ userId, ...body });
  }

  /**
   * 기록 수정
   * @param userId 유저 인덱스
   * @param UpdateRecordReqDto 기록 수정 요청 데이터
   * @returns 기록 수정 결과
   */
  async updateRecord(userId: string, body: UpdateRecordReqDto) {
    const record = await this.financialRecordRepository.updateRecord({ userId, ...body });
    if (!record) {
      throw new NotFoundException('not found record');
    }
    return;
  }

  /**
   * 기록 삭제
   * @param userId 유저 인덱스
   * @param DeleteRecordReqDto 기록 삭제 요청 데이터
   * @returns 기록 삭제 결과
   */
  async deleteRecord(userId: string, param: DeleteRecordReqDto) {
    const record = await this.financialRecordRepository.deleteRecord({ userId, ...param });

    if (!record) {
      throw new NotFoundException('not found record');
    }
    return;
  }

  /**
   * 최근 기록 리스트 조회
   * @param userId 유저 인덱스
   * @param PaginationDto 페이지네이션 요청 데이터
   * @returns 최근 기록 리스트
   */
  async findLatestRecords(userId: string, body: PaginationDto) {
    const { page, limit } = body;
    const skip = (page - 1) * limit;
    const recordDatas = await this.financialRecordRepository.findLatestRecords({
      userId,
      skip,
      limit,
    });
    const records = recordDatas.map((record) => {
      const data = {
        ...record,
        paymentSourceId: record.paymentSource.id,
        paymentType: record.paymentSource.paymentType,
        companyType: record.paymentSource.companyType,
        specialIdentifier: record.paymentSource.specialIdentifier,
        tagId: record.tag.id,
        tagName: record.tag.name,
        tagColor: record.tag.color,
        title: record.title,
        amount: record.amount,
        memo: record.memo,
        date: record.date,
      };
      return data;
    });
    return { records };
  }

  /**
   * 달력 기록 리스트 조회
   * @param userId 유저 인덱스
   * @param SearchDateIntervalDto 페이지네이션 요청 데이터
   * @returns 달력 별 기록 리스트
   */
  async findCalendarRecords(userId: string, body: SearchDateIntervalDto) {
    const { startDate, endDate } = body;
    const records = await this.financialRecordRepository.findRecordsByDate({
      userId,
      startDate,
      endDate,
    });

    const result: FindCalendarRecord[] = [];

    for (const record of records) {
      const formattedDate = dayjs(record.date).tz('Asia/Seoul').format('YYYY-MM-DD');

      let income = 0;
      let expense = 0;

      if (record.incomeExpenseType === FinancialRecordIncomeExpenseType.INCOME) {
        income += record.amount;
      } else {
        expense += record.amount;
      }

      if (result[result.length - 1]?.date === formattedDate) {
        const resultRecord = result[result.length - 1];
        resultRecord.income += income;
        resultRecord.expense += expense;
      } else {
        result.push({ date: formattedDate, income: income, expense: expense });
      }
    }

    return { calendarData: result };
  }

  /**
   * 날짜 별 기록 리스트 조회
   * @param userId 유저 인덱스
   * @param SearchDateIntervalDto 페이지네이션 요청 데이터
   * @returns 날짜 별 기록 리스트
   */
  async findRecordsByDate(userId: string, body: SearchDateIntervalDto) {
    const { startDate, endDate } = body;
    const recordDatas = await this.financialRecordRepository.findRecordsDetailByDate({
      userId,
      startDate,
      endDate,
    });
    const records = recordDatas.map((record) => {
      const data = {
        ...record,
        paymentSourceId: record.paymentSource.id,
        paymentType: record.paymentSource.paymentType,
        companyType: record.paymentSource.companyType,
        specialIdentifier: record.paymentSource.specialIdentifier,
        tagId: record.tag.id,
        tagName: record.tag.name,
        tagColor: record.tag.color,
        title: record.title,
        amount: record.amount,
        memo: record.memo,
        date: record.date,
      };
      return data;
    });
    return { records };
  }

  /**
   * 날짜 별 기록 리포트 조회
   * @param userId 유저 인덱스
   * @param SearchDateIntervalDto 날짜 구간 요청 데이터
   * @returns 날짜 별 기록 리포트
   */
  async findRecordReportsByDate(userId: string, body: SearchDateIntervalDto) {
    const { startDate, endDate } = body;

    const [totalIncome, totalExpense, tags, paymentSources, dayOfWeekExpenses, spendingTrend] =
      await Promise.all([
        this.financialRecordRepository.findRecordIncomeReportsByDate({
          userId,
          startDate,
          endDate,
        }),
        this.financialRecordRepository.findRecordExpenseReportsByDate({
          userId,
          startDate,
          endDate,
        }),
        this.financialRecordRepository.findRecordExpenseTagReportsByDate({
          userId,
          startDate,
          endDate,
        }),
        this.financialRecordRepository.findRecordExpensePaymentSourceReportsByDate({
          userId,
          startDate,
          endDate,
        }),
        this.financialRecordRepository.findRecordExpenseDayOfWeekExpensesReportsByDate({
          userId,
          startDate,
          endDate,
        }),
        this.financialRecordRepository.findRecordExpenseSpendingTrendReportsByDate({
          userId,
          startDate,
          endDate,
        }),
      ]);

    const [userTags, userPaymentSources] = await Promise.all([
      this.financialTagRepository.findTagsByUserId(userId),
      this.financialPaymentSourceRepository.findPaymentSourceList(userId),
    ]);

    // const tags = result[0].tags.map((tag) => {
    //   const userTag = userTags.find((userTag) => userTag._id.toString() === tag._id.toString());
    //   if (userTag) {
    //     const data = {
    //       _id: tag._id,
    //       name: userTag.name,
    //       color: userTag.color,
    //       totalAmount: tag.totalAmount,
    //     };
    //     return data;
    //   }
    // });

    // const paymentSources = result[0].paymentSource.map((paymentSource) => {
    //   const userPaymentSource = userPaymentSources.find(
    //     (userPaymentSource) => userPaymentSource._id.toString() === paymentSource._id.toString(),
    //   );
    //   if (userPaymentSource) {
    //     const data = {
    //       _id: paymentSource._id,
    //       paymentType: userPaymentSource.paymentType,
    //       companyType: userPaymentSource.companyType,
    //       specialIdentifier: userPaymentSource.specialIdentifier,
    //       totalAmount: paymentSource.totalAmount,
    //     };
    //     return data;
    //   }
    // });
    // const report = {
    //   tags,
    //   paymentSources,
    //   spendingTrend: result[0].spendingTrend,
    //   dayOfWeekExpenses: result[0].dayOfWeekExpenses,
    //   totalIncome: result[0].totalIncome,
    //   totalExpense: result[0].totalExpense,
    // };

    // return report;
  }

  /**
   * 날짜 별 특정 태그 기록 조회
   * @param userId 유저 인덱스
   * @param FindRecordsByDateAndTagIdReqDto 특정 태그 인덱스
   * @param PaginatedDateSearchDto 날짜 구간 요청 데이터
   * @returns 날짜 별 특정 태그 기록 조회
   */
  async findRecordsByDateAndTagId(
    userId: string,
    param: FindRecordsByDateAndTagIdReqDto,
    query: PaginatedDateSearchDto,
  ) {
    const { tagId } = param;
    const { startDate, endDate, page, limit } = query;

    const skip = (page - 1) * limit;

    const recordDatas = await this.financialRecordRepository.findRecordsByDateAndTagId({
      userId,
      startDate,
      endDate,
      tagId,
      skip,
      limit,
    });

    const records = recordDatas.map((record) => {
      const data = {
        ...record,
        paymentSourceId: record.paymentSource.id,
        paymentType: record.paymentSource.paymentType,
        companyType: record.paymentSource.companyType,
        specialIdentifier: record.paymentSource.specialIdentifier,
        tagId: record.tag.id,
        tagName: record.tag.name,
        tagColor: record.tag.color,
        title: record.title,
        amount: record.amount,
        memo: record.memo,
        date: record.date,
      };
      return data;
    });
    return { records };
  }

  /**
   * 날짜 별 특정 결제 수단 기록 조회
   * @param userId 유저 인덱스
   * @param FindRecordsByDateAndPaymentSourceIdReqDto 특정 태그 인덱스
   * @param PaginatedDateSearchDto 날짜 구간 요청 데이터
   * @returns 날짜 별 특정 결제 수단 기록 조회
   */
  async findRecordsByDateAndPaymentSourceId(
    userId: string,
    param: FindRecordsByDateAndPaymentSourceIdReqDto,
    query: PaginatedDateSearchDto,
  ) {
    const { paymentSourceId } = param;
    const { startDate, endDate, page, limit } = query;

    const skip = (page - 1) * limit;

    const recordDatas = await this.financialRecordRepository.findRecordsByDateAndPaymentSourceId({
      userId,
      startDate,
      endDate,
      paymentSourceId,
      skip,
      limit,
    });

    const records = recordDatas.map((record) => {
      const data = {
        ...record,
        paymentSourceId: record.paymentSource.id,
        paymentType: record.paymentSource.paymentType,
        companyType: record.paymentSource.companyType,
        specialIdentifier: record.paymentSource.specialIdentifier,
        tagId: record.tag.id,
        tagName: record.tag.name,
        tagColor: record.tag.color,
        title: record.title,
        amount: record.amount,
        memo: record.memo,
        date: record.date,
      };
      return data;
    });
    return { records };
  }
}
