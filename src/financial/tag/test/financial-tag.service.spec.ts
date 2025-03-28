import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';

import { FinancialTagService } from '../financial-tag.service';

describe('FinancialTagService', () => {
  let service: FinancialTagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [WinstonModule.forRoot({})],
      providers: [FinancialTagService, ConfigService],
    }).compile();

    service = module.get<FinancialTagService>(FinancialTagService);
  });

  describe('createTag', () => {
    it('', async () => {});
  });
});
