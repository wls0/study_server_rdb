import { Injectable } from '@nestjs/common';

import { FinancialPaymentSource } from '../../model/financial-payment-source.model';
import {
  ICreatePaymentSource,
  IDeletePaymentSource,
  IFindPaymentSource,
  IUpdatePaymentSourceByIdAndUserId,
  IUpdatePaymentSourceOrderByPaymentSourceId,
} from '../interface/financial-payment-source.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, IsNull, Repository } from 'typeorm';

@Injectable()
export class FinancialPaymentSourceRepository {
  constructor(
    @InjectRepository(FinancialPaymentSource)
    private financialPaymentSourceModel: Repository<FinancialPaymentSource>,
  ) {}

  /**
   * 결제 수단 조회
   * @param IFindPaymentSource
   * @returns
   */
  async findPaymentSource(dto: IFindPaymentSource) {
    const { userId, paymentType, companyType, specialIdentifier } = dto;
    return await this.financialPaymentSourceModel.findOne({
      where: {
        userId,
        paymentType,
        companyType,
        specialIdentifier,
        deletedAt: IsNull(),
      },
    });
  }

  /**
   * 결제 수단 생성
   * @param ICreatePaymentSource
   * @param session
   * @returns
   */
  async createPaymentSource(dto: ICreatePaymentSource, session?: EntityManager) {
    const model = session
      ? session.getRepository(FinancialPaymentSource)
      : this.financialPaymentSourceModel;
    return await model.save(dto);
  }

  /**
   * 결제 수단 목록 조회
   * @param userId
   * @returns
   */
  async findPaymentSourceList(userId: string) {
    return await this.financialPaymentSourceModel.find({
      where: { userId, deletedAt: IsNull() },
      order: { paymentSourceOrder: 'ASC' },
    });
  }

  /**
   * 결제 수단 인덱스와 유저 ID로 결제 수단 업데이트
   * @param IUpdatePaymentSourceByIdAndUserId
   * @returns
   */
  async updatePaymentSourceByIdAndUserId(dto: IUpdatePaymentSourceByIdAndUserId) {
    const { paymentSourceId, userId, paymentType, companyType, specialIdentifier } = dto;

    return await this.financialPaymentSourceModel.update(
      { id: paymentSourceId, userId, deletedAt: IsNull() },
      { paymentType, companyType, specialIdentifier },
    );
  }

  /**
   * 결제 수단 삭제
   * @param IDeletePaymentSource
   * @returns
   */
  async deletePaymentSource(dto: IDeletePaymentSource, session?: EntityManager) {
    const { paymentSourceId, userId } = dto;
    const model = session
      ? session.getRepository(FinancialPaymentSource)
      : this.financialPaymentSourceModel;

    return await model.softDelete({
      id: paymentSourceId,
      userId,
      deletedAt: IsNull(),
    });
  }

  /**
   * 결제 수단 조회
   * @param string
   * @returns 결제 수단
   */
  async findPaymentSourceById(paymentSourceId: number) {
    return await this.financialPaymentSourceModel.findOne({ where: { id: paymentSourceId } });
  }

  /**
   * 유저 인덱스로 삭제된 결제 수단 조회
   * @param userId
   * @returns
   */
  async findDeletedPaymentSourceById(userId: string) {
    return await this.financialPaymentSourceModel.findOne({
      where: { userId, isDeleted: IsNull() },
    });
  }

  /**
   * 유저 인덱스로 마지막 결제 수단 조회
   * @param userId
   * @returns
   */
  async findLastPaymentSourceByUserId(userId: string) {
    return await this.financialPaymentSourceModel.findOne({
      where: { userId, deletedAt: IsNull() },
      order: { paymentSourceOrder: 'DESC' },
    });
  }

  /**
   * 결제 수단 전체 삭제
   * @param userId
   * @returns
   */
  async deleteUserTotalPaymentSourceByUserId(userId: string, session?: EntityManager) {
    const model = session
      ? session.getRepository(FinancialPaymentSource)
      : this.financialPaymentSourceModel;

    return await model.softDelete({ userId, deletedAt: IsNull() });
  }

  /**
   * 결제 수단 순서 업데이트
   * @param
   * @returns
   */
  async updatePaymentSourceOrderByPaymentSourceId(
    data: IUpdatePaymentSourceOrderByPaymentSourceId,
    session?: EntityManager,
  ) {
    const { paymentSourceId, paymentSourceOrder } = data;

    const model = session
      ? session.getRepository(FinancialPaymentSource)
      : this.financialPaymentSourceModel;

    await model.update({ id: paymentSourceId }, { paymentSourceOrder });
  }
}
