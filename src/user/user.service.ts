import { ConflictException, Injectable } from '@nestjs/common';

import { FinancialService } from '../financial/financial.service';
import { CreateUserDto, UpdateNicknameDto, CheckNicknameDto } from './dto/user.req.dto';
import { SocialAuth } from './enum/user.enum';
import { IUser } from './interfaces/user.interface';
import { UserRepository } from './repositories/user.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource,
    private readonly financialService: FinancialService,
  ) {}

  /**
   * @param CheckNicknameDto
   * 닉네임 중복 체크
   */
  async checkNickname(body: CheckNicknameDto) {
    const { nickname } = body;

    const user = await this.userRepository.findUserByNickname(nickname);

    return { isExist: !!user };
  }

  private async _nicknameMaker() {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomNumber = Array.from(
      { length: 6 },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join('');
    const nickname = `user-${randomNumber}`;
    const nicknameCheck = await this.userRepository.findUserByNickname(nickname);

    if (nicknameCheck) {
      return this._nicknameMaker();
    }

    return nickname;
  }

  /**
   * @param CreateUserDto
   * 회원 가입
   */
  // TODO: 실제 데이터 apple가 넘어오는거 확인하고 Dto 수정 될 예정 전화 번호 필요 시 저장하는 방식으로 사용 할 예정
  async createUser(body: CreateUserDto) {
    const { authId, auth, name, email } = body;

    const user = await this.userRepository.findUserByAuthIdAndAuth({ authId, auth });

    if (user) {
      throw new ConflictException('already exists user');
    }

    const nickname = await this._nicknameMaker();
    let id = '';
    await this.dataSource.transaction(async (session) => {
      const userId = await this.userRepository.createUser(
        { authId, auth, name, email, nickname },
        session,
      );
      id = userId;
      await this.financialService.firstTagAndPaymentSourceSetting(userId, session);
    });

    return id;
  }

  /**
   * @param userId
   * @param UpdateNicknameDto
   * 닉네임 수정
   */
  async updateNickname(userId: string, body: UpdateNicknameDto) {
    const { nickname } = body;
    const nicknameCheck = await this.userRepository.findUserByNickname(nickname);

    if (nicknameCheck) {
      throw new ConflictException('already exists nickname');
    }

    await this.userRepository.updateNickname({ id: userId, nickname: nickname.replace(' ', '') });
    return;
  }

  /**
   * @param user
   * 유저 정보 조회
   */
  async getUserInfo(user: IUser) {
    return user;
  }

  /**
   * 유저 조회
   * @param authId
   * @param auth
   * @returns
   */
  async getUserByAuthIdAndAuth(authId: string, auth: SocialAuth) {
    return await this.userRepository.findUserByAuthIdAndAuth({ authId, auth });
  }

  /**
   * 회원탈퇴
   * @param userId
   * @returns
   */
  async deleteUser(userId: string) {
    this.dataSource.transaction(async () => {});

    try {
      await this.dataSource.transaction(async (session) => {
        await this.userRepository.deleteUser(userId, session);
        // await this.financialService.deleteFinancialData(userId, session);
      });
      return;
    } catch (err) {
      throw err;
    }
  }

  /**
   * 전체 유저 조회
   * @returns List<IUser>
   */
  async getTotalUser() {
    return await this.userRepository.getTotalUser();
  }

  /**
   * fcmToken 업데이트
   * @param userId
   * @param fcmToken
   * @returns
   */
  async updateUserFcmToken(userId: string, fcmToken: string) {
    await this.userRepository.updateUserFcmToken(userId, fcmToken);
    return;
  }
}
