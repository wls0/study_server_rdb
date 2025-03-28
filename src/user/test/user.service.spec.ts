import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserRepository } from '../repositories/user.repository';
import * as mock from './user.mock';
import { CreateUserDto } from '../dto/user.req.dto';
import { ConflictException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { FinancialService } from '../../financial/financial.service';
import { TypeOrmModule } from '@nestjs/typeorm';
describe('UserService', () => {
  let service: UserService;
  let userRepository: UserRepository;
  let financialService: FinancialService;
  let dataSource: DataSource;

  const session = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: {} },

        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn().mockImplementation(async (callback) => {
              return await callback(session);
            }),
          },
        },
        { provide: FinancialService, useValue: {} },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    financialService = module.get<FinancialService>(FinancialService);
    dataSource = module.get<DataSource>(DataSource);
  });

  describe('createUser', () => {
    const req: CreateUserDto = {
      authId: '1234',
      auth: 'apple',
      name: '123',
      email: '23423@test.com',
    };
    const userId = '123134';
    const nickname = 'nickname';
    it('이미 유저가 있을 때', async () => {
      userRepository.findUserByAuthIdAndAuth = jest.fn().mockReturnValue(mock.user);

      await expect(async () => {
        await service.createUser(req);
      }).rejects.toThrow(new ConflictException('already exists user'));
    });

    it('정상 작동', async () => {
      userRepository.findUserByAuthIdAndAuth = jest.fn().mockReturnValue(null);
      userRepository.createUser = jest.fn().mockReturnValue(userId);
      financialService.firstTagAndPaymentSourceSetting = jest.fn();
      service['_nicknameMaker'] = jest.fn().mockReturnValue(nickname);

      await service.createUser(req);
      expect(userRepository.findUserByAuthIdAndAuth).toHaveBeenCalledWith({
        authId: req.authId,
        auth: req.auth,
      });
      expect(dataSource.transaction).toHaveBeenCalled();
      expect(userRepository.createUser).toHaveBeenCalledWith(
        {
          authId: req.authId,
          auth: req.auth,
          name: req.name,
          email: req.email,
          nickname: nickname,
        },
        session,
      );
      expect(financialService.firstTagAndPaymentSourceSetting).toHaveBeenCalledWith(
        userId,
        session,
      );
    });
  });
});
