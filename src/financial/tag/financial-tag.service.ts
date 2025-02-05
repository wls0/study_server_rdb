import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import {
  CreateTagReqDto,
  DeleteTagReqDto,
  UpdateFinancialTagOrderReqDto,
  UpdateTagReqDto,
} from '../dto/financial-tag.req.dto';
import { FinancialRecordRepository } from '../repositories/financial-record.repository';
import { FinancialTagRepository } from '../repositories/financial-tag.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class FinancialTagService {
  constructor(
    private readonly tagRepository: FinancialTagRepository,
    private readonly financialRecordRepository: FinancialRecordRepository,
    private readonly dataSource: DataSource,
  ) {}

  /** 태그 생성
   * @param CreateTagReqDto
   * @returns
   */
  async createTag(userId: string, data: CreateTagReqDto) {
    const { name, color } = data;

    const tag = await this.tagRepository.findTagByUserIdAndName({ userId, name });

    if (tag) {
      throw new ConflictException('tag already exists.');
    }

    const lastTag = await this.tagRepository.findLastTagOrderByUserId(userId);
    let newTagOrder = 0;

    if (lastTag) {
      newTagOrder = lastTag.tagOrder + 1;
    }

    return await this.tagRepository.createTag({ userId, name, color, tagOrder: newTagOrder });
  }

  /**
   * 태그 리스트 조회
   * @param userId
   * @returns
   */
  async findFinancialTagsByUserId(userId: string) {
    const tags = await this.tagRepository.findTagsByUserId(userId);
    return { tags };
  }

  /**
   * 태그 수정
   * @param userId
   * @param UpdateTagReqDto
   * @returns
   */
  async updateFinancialRecordTag(userId: string, data: UpdateTagReqDto) {
    const { tagId, name, color } = data;

    const tag = await this.tagRepository.updateTagByUserIdAndTagId({ userId, tagId, name, color });

    if (!tag) {
      throw new NotFoundException('tag not found.');
    }

    return;
  }

  /**
   * 태그 삭제
   * @param userId
   * @param DeleteTagReqDto
   * @returns
   */
  async deleteFinancialRecordTag(userId: string, data: DeleteTagReqDto) {
    const { tagId } = data;

    try {
      const [beforTagId, afterTagId] = await Promise.all([
        this.tagRepository.findTagById(tagId),
        this.tagRepository.findDeletedTagById(userId),
      ]);

      if (!beforTagId) {
        throw new NotFoundException('tag not found.');
      }

      if (!afterTagId) {
        throw new NotFoundException('deleted tagId not found.');
      }

      await this.dataSource.transaction(async (session) => {
        await this.financialRecordRepository.updateRecordsTagByTagId(
          { beforTagId: beforTagId.id, afterTagId: afterTagId.id },
          session,
        );
        await this.tagRepository.deleteTagByUserIdAndTagId({ userId, tagId }, session);
        return;
      });

      return;
    } catch (err) {
      throw err;
    }
  }

  /**
   * 태그 순서 수정
   * @param userId
   * @param DeleteTagReqDto
   * @returns
   */
  async updateFinancialTagOrder(userId: string, body: UpdateFinancialTagOrderReqDto) {
    const { tagIds } = body;

    const tags = await this.tagRepository.findTagsByUserId(userId);

    try {
      await this.dataSource.transaction(async (session) => {
        let tagOrder = 2;

        for (const tagId of tagIds) {
          const checkedTag = tags.find((el) => el.id === tagId);

          if (!checkedTag) {
            throw new NotFoundException('not found tagId');
          }

          await this.tagRepository.updateTagOrderByTagId(
            {
              tagId,
              tagOrder: tagOrder,
            },
            session,
          );

          tagOrder++;
        }
      });

      return;
    } catch (err) {
      throw err;
    }
  }
}
