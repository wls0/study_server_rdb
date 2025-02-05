import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import {
  CreatePaymentSourceReqDto,
  DeletePaymentSourceReqDto,
  UpdatePaymentSourceOrderReqDto,
  UpdatePaymentSourceReqDto,
} from '../dto/financial-payment-source.req.dto';
import { FinancialPaymentSourceRepository } from '../repositories/financial-payment-source.repository';
import { FinancialRecordRepository } from '../repositories/financial-record.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class FinancialPaymentSourceService {
  constructor(
    private readonly financialPaymentSourceRepository: FinancialPaymentSourceRepository,
    private readonly financialRecordRepository: FinancialRecordRepository,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * 결제 수단 생성
   * @param userId
   * @param CreatePaymentSourceReqDto
   */
  async createPaymentSource(userId: string, body: CreatePaymentSourceReqDto) {
    const { paymentType, companyType, specialIdentifier } = body;

    const paymentSource = await this.financialPaymentSourceRepository.findPaymentSource({
      userId,
      paymentType,
      companyType,
      specialIdentifier: specialIdentifier ?? '',
    });

    if (paymentSource) {
      throw new ConflictException('payment source already exists');
    }

    const lastPaymentOrder =
      await this.financialPaymentSourceRepository.findLastPaymentSourceByUserId(userId);

    let newPaymentOrder = 0;

    if (lastPaymentOrder) {
      newPaymentOrder = lastPaymentOrder.paymentSourceOrder + 1;
    }

    await this.financialPaymentSourceRepository.createPaymentSource({
      userId,
      paymentType,
      companyType,
      specialIdentifier,
      paymentSourceOrder: newPaymentOrder,
    });
    return;
  }

  /**
   * 결제 수단 목록 조회
   * @param userId
   * @returns
   */
  async findPaymentSourceList(userId: string) {
    const paymentSourceList =
      await this.financialPaymentSourceRepository.findPaymentSourceList(userId);
    return { paymentSourceList };
  }

  /**
   * 결제 수단 수정
   * @param userId
   * @param UpdatePaymentSourceReqDto
   */
  async updatePaymentSource(userId: string, body: UpdatePaymentSourceReqDto) {
    const { paymentSourceId, paymentType, companyType, specialIdentifier } = body;

    const paymentSource =
      await this.financialPaymentSourceRepository.updatePaymentSourceByIdAndUserId({
        paymentSourceId,
        userId,
        paymentType,
        companyType,
        specialIdentifier,
      });

    if (!paymentSource) {
      throw new NotFoundException('not found payment source');
    }

    return;
  }

  /**
   * 결제 수단 삭제
   * @param userId
   * @param DeletePaymentSourceReqDto
   */
  async deletePaymentSource(userId: string, body: DeletePaymentSourceReqDto) {
    const { paymentSourceId } = body;

    try {
      const [beforPaymentSource, afterPaymentSource] = await Promise.all([
        this.financialPaymentSourceRepository.findPaymentSourceById(paymentSourceId),
        this.financialPaymentSourceRepository.findDeletedPaymentSourceById(userId),
      ]);

      if (!beforPaymentSource) {
        throw new NotFoundException('tag not found.');
      }

      if (!afterPaymentSource) {
        throw new NotFoundException('deleted tagId not found.');
      }

      await this.dataSource.transaction(async (session) => {
        await this.financialRecordRepository.updateRecordsPaymentByPaymentId(
          {
            beforPaymentSourceId: beforPaymentSource.id,
            afterPaymentSourceId: afterPaymentSource.id,
          },
          session,
        );
        await this.financialPaymentSourceRepository.deletePaymentSource(
          {
            paymentSourceId,
            userId,
          },
          session,
        );
        return;
      });

      return;
    } catch (err) {
      throw err;
    }
  }

  async updatePaymentSourceOrder(userId: string, body: UpdatePaymentSourceOrderReqDto) {
    const { paymentSourceIds } = body;

    const paymentSources =
      await this.financialPaymentSourceRepository.findPaymentSourceList(userId);

    try {
      await this.dataSource.transaction(async (session) => {
        let paymentSourceOrder = 1;
        for (const paymentSourceId of paymentSourceIds) {
          const checkedPaymentSource = paymentSources.find(
            (el) => el.id.toString() === paymentSourceId.toString(),
          );

          if (!checkedPaymentSource) {
            throw new NotFoundException('not found paymentSourceId');
          }

          await this.financialPaymentSourceRepository.updatePaymentSourceOrderByPaymentSourceId(
            {
              paymentSourceId,
              paymentSourceOrder,
            },
            session,
          );

          paymentSourceOrder++;
        }
        return;
      });

      return;
    } catch (err) {
      throw err;
    }
  }
}
