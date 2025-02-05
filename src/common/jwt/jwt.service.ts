import { Injectable } from '@nestjs/common';

import { User } from '../../model/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class JwtService {
  constructor(@InjectRepository(User) private userModel: Repository<User>) {}

  /**
   * 유저 조회
   * @param userId
   * @returns
   */
  async getUser(userId: string) {
    return await this.userModel.findOne({ where: { id: userId } });
  }
}
