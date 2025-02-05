import { Injectable } from '@nestjs/common';

import { FinancialTag } from '../../model/financial-tag.model';
import {
  ICreateTag,
  IDeleteTagByUserIdAndTagId,
  IFindTagByUserIdAndName,
  IUpdateTag,
  IUpdateTagOrderByTagId,
} from '../interface/financial-tag.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, IsNull, Repository } from 'typeorm';

@Injectable()
export class FinancialTagRepository {
  constructor(
    @InjectRepository(FinancialTag) private financialTagModel: Repository<FinancialTag>,
  ) {}

  /**
   * 유저 인덱스, 태그 이름으로 조회
   * @param IFindTagByUserIdAndName
   * @returns
   */
  async findTagByUserIdAndName(data: IFindTagByUserIdAndName) {
    const { userId, name } = data;
    return await this.financialTagModel.findOne({ where: { userId, name, deletedAt: IsNull() } });
  }

  /**
   * 태그 생성
   * @param ICreateTag
   * @param session
   * @returns
   */
  async createTag(data: ICreateTag, session?: EntityManager) {
    const model = session ? session.getRepository(FinancialTag) : this.financialTagModel;
    return await model.save(data);
  }

  /**
   * 유저 인덱스로 태그 전체 조회
   * @param userId
   * @returns
   */
  async findTagsByUserId(userId: string) {
    return await this.financialTagModel.find({
      where: { userId, deletedAt: IsNull() },
      order: { tagOrder: 'ASC' },
    });
  }

  /**
   * 유저 인덱스, 태그 인덱스로 태그 수정
   * @param userId
   * @param IUpdateTag
   * @returns
   */
  async updateTagByUserIdAndTagId(data: IUpdateTag) {
    const { userId, tagId, name, color } = data;
    return await this.financialTagModel.update(
      { id: tagId, userId, deletedAt: IsNull() },
      { name, color },
    );
  }

  /**
   * 유저 인덱스, 태그 인덱스로 태그 삭제
   * @param IDeleteTagByUserIdAndTagId
   * @param session
   * @returns
   */
  async deleteTagByUserIdAndTagId(data: IDeleteTagByUserIdAndTagId, session?: EntityManager) {
    const { userId, tagId } = data;
    const model = session ? session.getRepository(FinancialTag) : this.financialTagModel;
    return await model.softDelete({ id: tagId, userId, deletedAt: IsNull() });
  }

  /**
   * 태그 인덱스로 태그 조회
   * @param tagId
   */
  async findTagById(tagId: number) {
    return await this.financialTagModel.findOne({ where: { id: tagId } });
  }

  /**
   * 유저 인덱스로 삭제된 태그 조회
   * @param userId
   */
  async findDeletedTagById(userId: string) {
    return await this.financialTagModel.findOne({ where: { userId, isDeleted: true } });
  }

  /**
   * 유저 인덱스로 마지막 태그 조회
   * @param userId
   * @returns
   */
  async findLastTagOrderByUserId(userId: string) {
    return await this.financialTagModel.findOne({
      where: { userId, deletedAt: IsNull() },
      order: { tagOrder: 'DESC' },
    });
  }

  /**
   * 태그 전체 삭제
   * @param userId
   * @returns
   */
  async deleteUserTotalTagByUserId(userId: string, session?: EntityManager) {
    const model = session ? session.getRepository(FinancialTag) : this.financialTagModel;
    return await model.softDelete({ userId, deletedAt: IsNull() });
  }

  /**
   * 태그 순서 업데이트
   * @param IUpdateTagOrderByTagId
   * @returns
   */
  async updateTagOrderByTagId(data: IUpdateTagOrderByTagId, session?: EntityManager) {
    const { tagId, tagOrder } = data;
    const model = session ? session.getRepository(FinancialTag) : this.financialTagModel;
    return await model.update({ id: tagId }, { tagOrder });
  }
}
