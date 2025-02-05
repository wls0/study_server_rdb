import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { FinancialPaymentSourceService } from './financial-payment-source.service';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { ResponseDto } from '../../common/dto/common.res.dto';
import { JwtUserGuard } from '../../common/jwt/jwt.guard';
import { IUser } from '../../user/interfaces/user.interface';
import { FindPaymentSourceListDto } from '../dto/financial-payment-source.dto';
import {
  CreatePaymentSourceReqDto,
  DeletePaymentSourceReqDto,
  UpdatePaymentSourceOrderReqDto,
  UpdatePaymentSourceReqDto,
} from '../dto/financial-payment-source.req.dto';
import { FindPaymentSourceListResDto } from '../dto/financial-payment-source.res.dto';

@UseGuards(JwtUserGuard)
@ApiTags('financial/payment-source')
@Controller('financial/payment-source')
export class FinancialPaymentSourceController {
  constructor(private readonly financialPaymentSourceService: FinancialPaymentSourceService) {}

  @ApiOperation({ summary: '결제 수단 생성' })
  @ApiResponse({ status: 201, type: ResponseDto })
  @Post('/')
  async createPaymentSource(@CurrentUser() user: IUser, @Body() body: CreatePaymentSourceReqDto) {
    const { id } = user;
    return await this.financialPaymentSourceService.createPaymentSource(id, body);
  }

  @ApiOperation({ summary: '결제 수단 목록 조회' })
  @ApiResponse({ status: 200, type: FindPaymentSourceListResDto })
  @Get('/list')
  async findPaymentSourceList(@CurrentUser() user: IUser) {
    const { id } = user;
    const result = await this.financialPaymentSourceService.findPaymentSourceList(id);
    return plainToInstance(FindPaymentSourceListDto, result);
  }

  @ApiOperation({ summary: '결제 수단 수정' })
  @ApiResponse({ status: 200, type: ResponseDto })
  @Patch('/')
  async updatePaymentSource(@CurrentUser() user: IUser, @Body() body: UpdatePaymentSourceReqDto) {
    const { id } = user;
    return await this.financialPaymentSourceService.updatePaymentSource(id, body);
  }

  @ApiOperation({ summary: '결제 수단 삭제' })
  @ApiResponse({ status: 200, type: ResponseDto })
  @Delete('/:paymentSourceId')
  async deletePaymentSource(@CurrentUser() user: IUser, @Param() query: DeletePaymentSourceReqDto) {
    const { id } = user;
    return await this.financialPaymentSourceService.deletePaymentSource(id, query);
  }

  @ApiOperation({ summary: '결제 수단 순서 수정' })
  @ApiResponse({ status: 200, type: ResponseDto })
  @Patch('/order')
  async updatePaymentSourceOrder(
    @CurrentUser() user: IUser,
    @Body() body: UpdatePaymentSourceOrderReqDto,
  ) {
    const { id } = user;
    return await this.financialPaymentSourceService.updatePaymentSourceOrder(id, body);
  }
}
