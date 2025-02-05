import { Injectable } from '@nestjs/common';

import { User } from '../../model/user.model';
import {
  ICreateUser,
  IFindUserByAuthIdAndAuth,
  IUpdateNickname,
} from '../interfaces/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, IsNull, Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(@InjectRepository(User) private userModel: Repository<User>) {}

  /**
   * 닉네임 중복 체크
   * @param nickname
   * @returns
   */
  async findUserByNickname(nickname: string) {
    return await this.userModel.findOne({ where: { nickname } });
  }

  /**
   * 고유 아이디와 인증 타입으로 유저 정보 조회
   * @param IFindUserByAuthIdAndAuth
   * @returns
   */
  async findUserByAuthIdAndAuth(data: IFindUserByAuthIdAndAuth) {
    const { authId, auth } = data;
    return await this.userModel.findOne({ where: { auth, authId, deletedAt: IsNull() } });
  }

  /**
   * 회원가입
   * @param CreateUserDto
   * @param session
   * @returns
   */
  async createUser(data: ICreateUser, session: EntityManager | null = null) {
    const model = session ? session.getRepository(User) : this.userModel;
    const user = await model.save({ ...data });
    return user.id;
  }

  /**
   * 닉네임 수정
   * @param IUpdateNickname
   * @returns
   */
  async updateNickname(data: IUpdateNickname) {
    const { id, nickname } = data;
    return await this.userModel.update({ id }, { nickname });
  }

  /**
   * 회원탈퇴
   * @param userId
   * @returns
   */
  async deleteUser(userId: string, session: EntityManager) {
    const model = session ? session.getRepository(User) : this.userModel;
    await model.update(
      { id: userId },
      { authId: 'deleted', nickname: '', phone: '', email: '', name: '', deletedAt: new Date() },
    );
    return;
  }

  /**
   * 전체 유저 조회
   * @returns List<IUser>
   */
  async getTotalUser() {
    return await this.userModel.find({ where: { deletedAt: IsNull() } });
  }

  /**
   * fcmToken 업데이트
   * @param userId
   * @param fcmToken
   */
  async updateUserFcmToken(userId: string, fcmToken: string) {
    await this.userModel.update({ id: userId }, { fcmToken });
  }
}
