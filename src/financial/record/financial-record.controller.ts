import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { FinancialRecordService } from './financial-record.service';
import { CurrentUser } from '../../common/decorators/user.decorator';
import {
  PaginatedDateSearchDto,
  PaginationDto,
  SearchDateIntervalDto,
} from '../../common/dto/common.req.dto';
import { ResponseDto } from '../../common/dto/common.res.dto';
import { JwtUserGuard } from '../../common/jwt/jwt.guard';
import { IUser } from '../../user/interfaces/user.interface';
import {
  FindCalendarRecordDto,
  FindFinancialRecordsDto,
  FindRecordReportsByDateDto,
} from '../dto/financial-record.dto';
import {
  CreateRecordReqDto,
  DeleteRecordReqDto,
  FindRecordsByDateAndPaymentSourceIdReqDto,
  FindRecordsByDateAndTagIdReqDto,
  UpdateRecordReqDto,
} from '../dto/financial-record.req.dto';
import {
  FindCalendarRecordResDto,
  FindFinancialRecordsResDto,
  FindRecordReportsByDateResDto,
} from '../dto/financial-record.res.dto';

@UseGuards(JwtUserGuard)
@ApiTags('financial/record')
@Controller('financial/record')
export class FinancialRecordController {
  constructor(private readonly financialRecordService: FinancialRecordService) {}

  @ApiOperation({ summary: '기록 생성' })
  @ApiResponse({ status: 201, type: ResponseDto })
  @Post('/')
  async createRecord(@CurrentUser() user: IUser, @Body() body: CreateRecordReqDto) {
    const { id } = user;
    return await this.financialRecordService.createRecord(id, body);
  }

  @ApiOperation({ summary: '기록 수정' })
  @ApiResponse({ status: 200, type: ResponseDto })
  @Patch('/')
  async updateRecord(@CurrentUser() user: IUser, @Body() body: UpdateRecordReqDto) {
    const { id } = user;
    return await this.financialRecordService.updateRecord(id, body);
  }

  @ApiOperation({ summary: '기록 삭제' })
  @ApiResponse({ status: 200, type: ResponseDto })
  @Delete('/:recordId')
  async deleteRecord(@CurrentUser() user: IUser, @Param() param: DeleteRecordReqDto) {
    const { id } = user;
    return await this.financialRecordService.deleteRecord(id, param);
  }

  @ApiOperation({ summary: '최근 기록 리스트 조회' })
  @ApiResponse({ status: 200, type: FindFinancialRecordsResDto })
  @Get('/latest/list')
  async findLatestRecords(@CurrentUser() user: IUser, @Query() query: PaginationDto) {
    const { id } = user;
    const result = await this.financialRecordService.findLatestRecords(id, query);
    return plainToInstance(FindFinancialRecordsDto, result);
  }

  @ApiOperation({ summary: '달력 별 리스트 조회' })
  @ApiResponse({ status: 200, type: FindCalendarRecordResDto })
  @Get('/calendar/list')
  async findCalendarRecord(@CurrentUser() user: IUser, @Query() query: SearchDateIntervalDto) {
    const { id } = user;
    const result = await this.financialRecordService.findCalendarRecords(id, query);
    return plainToInstance(FindCalendarRecordDto, result);
  }

  @ApiOperation({ summary: '날짜 별 리스트 조회' })
  @ApiResponse({ status: 200, type: FindFinancialRecordsResDto })
  @Get('/detail/list')
  async findRecordsByDate(@CurrentUser() user: IUser, @Query() query: SearchDateIntervalDto) {
    const { id } = user;
    const result = await this.financialRecordService.findRecordsByDate(id, query);
    return plainToInstance(FindFinancialRecordsDto, result);
  }

  @ApiOperation({ summary: '날짜 별 기록 리포트 조회' })
  @ApiResponse({ status: 200, type: FindRecordReportsByDateResDto })
  @Get('/report/list')
  async findRecordReportsByDate(@CurrentUser() user: IUser, @Query() query: SearchDateIntervalDto) {
    const { id } = user;
    const result = await this.financialRecordService.findRecordReportsByDate(id, query);
    return plainToInstance(FindRecordReportsByDateDto, result);
  }

  @ApiOperation({ summary: '날짜 별 특정 태그 기록 조회' })
  @ApiResponse({ status: 200, type: FindFinancialRecordsResDto })
  @Get('/tag/:tagId/list')
  async findRecordsByDateAndTagId(
    @CurrentUser() user: IUser,
    @Param() param: FindRecordsByDateAndTagIdReqDto,
    @Query() query: PaginatedDateSearchDto,
  ) {
    const { id } = user;
    const result = await this.financialRecordService.findRecordsByDateAndTagId(id, param, query);
    return plainToInstance(FindFinancialRecordsDto, result);
  }

  @ApiOperation({ summary: '날짜 별 특정 결제 수단 기록 조회' })
  @ApiResponse({ status: 200, type: FindFinancialRecordsResDto })
  @Get('/payment-source/:paymentSourceId/list')
  async findRecordsByDateAndPaymentSourceId(
    @CurrentUser() user: IUser,
    @Param() param: FindRecordsByDateAndPaymentSourceIdReqDto,
    @Query() query: PaginatedDateSearchDto,
  ) {
    const { id } = user;
    const result = await this.financialRecordService.findRecordsByDateAndPaymentSourceId(
      id,
      param,
      query,
    );
    return plainToInstance(FindFinancialRecordsDto, result);
  }
}
