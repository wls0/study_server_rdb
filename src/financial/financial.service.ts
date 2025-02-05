import { Injectable } from '@nestjs/common';

import { PaymentSourceType } from './enum/financial-payment-source.enum';
import { FinancialPaymentSourceRepository } from './repositories/financial-payment-source.repository';
import { FinancialRecordRepository } from './repositories/financial-record.repository';
import { FinancialTagRepository } from './repositories/financial-tag.repository';
import { EntityManager } from 'typeorm';

@Injectable()
export class FinancialService {
  constructor(
    private readonly financialTagRepository: FinancialTagRepository,
    private readonly financialPaymentSourceRepository: FinancialPaymentSourceRepository,
    private readonly financialRecordRepository: FinancialRecordRepository,
  ) {}

  /**
   * 처음 태그, 결제 수단 세팅
   * @param userId
   * @param session
   * @returns
   */
  async firstTagAndPaymentSourceSetting(userId: string, session: EntityManager) {
    try {
      const defaultTags = [
        { name: '삭제된 태그', color: 'ff4a4a4a', isDeleted: true },
        { name: '수익', color: 'ffffc107', isIncome: true },
        { name: '식비', color: 'ffffb3ba' },
        { name: '교통비', color: 'ffbae1ff' },
        { name: '주거비', color: 'ffbaffca' },
        { name: '통신비', color: 'fffff2b3' },
        { name: '의료비', color: 'ffe6ccff' },
        { name: '문화생활', color: 'ffffd1ba' },
        { name: '교육비', color: 'ffd1ffba' },
      ];

      const settings: any = [];
      let tagOrder = 0;

      for (const tag of defaultTags) {
        settings.push(
          this.financialTagRepository.createTag({ userId, ...tag, tagOrder: tagOrder }, session),
        );
        tagOrder++;
      }
      settings.push(
        this.financialPaymentSourceRepository.createPaymentSource(
          {
            userId,
            paymentType: PaymentSourceType.DELETE,
            companyType: '삭제된 결제수단',
            specialIdentifier: '',
            isDeleted: true,
            paymentSourceOrder: 0,
          },
          session,
        ),
      );

      settings.push(
        this.financialPaymentSourceRepository.createPaymentSource(
          {
            userId,
            paymentType: PaymentSourceType.CASH,
            companyType: '현금',
            specialIdentifier: '',
            paymentSourceOrder: 1,
          },
          session,
        ),
      );
      await Promise.all(settings);
      return;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 유저 탈퇴;
   */
  async deleteFinancialData(userId: string, session: EntityManager) {
    try {
      await this.financialTagRepository.deleteUserTotalTagByUserId(userId, session);
      await this.financialPaymentSourceRepository.deleteUserTotalPaymentSourceByUserId(
        userId,
        session,
      );
    } catch (error) {
      throw error;
    }
  }
}
