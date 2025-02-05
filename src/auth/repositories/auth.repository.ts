import { Injectable } from '@nestjs/common';

import { RefreshToken } from '../../model/refresh-token.model';
import { ICreateRefreshToken } from '../interfaces/auth.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenModel: Repository<RefreshToken>,
  ) {}

  /**
   * 리프레시 토큰 삭제
   * @param userId 유저 _id
   * @returns
   */
  async deleteToken(userId: string): Promise<void> {
    await this.refreshTokenModel.delete({ userId });
  }

  /**
   * 리프레시 토큰 조회
   * @param refreshToken 리프레시 토큰
   * @returns
   */
  async findRefreshToken(id: string) {
    return await this.refreshTokenModel.findOne({ where: { id } });
  }

  /**
   * 리프레시 토큰 생성
   * @param ICreateRefreshToken 리프레시 토큰 생성 데이터
   * @returns
   */
  async createRefreshToken(data: ICreateRefreshToken) {
    const { userId, refreshToken } = data;
    return await this.refreshTokenModel.save({
      userId,
      refreshToken: refreshToken,
    });
  }
}
