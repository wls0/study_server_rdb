import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { FinancialTagService } from './financial-tag.service';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { ResponseDto } from '../../common/dto/common.res.dto';
import { JwtUserGuard } from '../../common/jwt/jwt.guard';
import { IUser } from '../../user/interfaces/user.interface';
import { FindFinancialTagsDto } from '../dto/financial-tag.dto';
import {
  CreateTagReqDto,
  DeleteTagReqDto,
  UpdateFinancialTagOrderReqDto,
  UpdateTagReqDto,
} from '../dto/financial-tag.req.dto';
import { FindFinancialTagsResDto } from '../dto/financial-tag.res.dto';

@UseGuards(JwtUserGuard)
@ApiTags('financial/tag')
@Controller('financial/tag')
export class FinancialTagController {
  constructor(private readonly financialTagService: FinancialTagService) {}

  @ApiOperation({ summary: '결제 태그 생성' })
  @ApiResponse({ status: 201, type: ResponseDto })
  @Post('/')
  async createTag(@CurrentUser() user: IUser, @Body() body: CreateTagReqDto) {
    const { id } = user;
    return await this.financialTagService.createTag(id, body);
  }

  @ApiOperation({ summary: '결제 태그 리스트 조회' })
  @ApiResponse({ status: 200, type: FindFinancialTagsResDto })
  @Get('/list')
  async findFinancialTags(@CurrentUser() user: IUser) {
    const { id } = user;
    const result = await this.financialTagService.findFinancialTagsByUserId(id);
    return plainToInstance(FindFinancialTagsDto, result);
  }

  @ApiOperation({ summary: '결제 태그 수정' })
  @ApiResponse({ status: 200, type: ResponseDto })
  @Patch('/')
  async updateFinancialRecordTag(@CurrentUser() user: IUser, @Body() body: UpdateTagReqDto) {
    const { id } = user;
    return await this.financialTagService.updateFinancialRecordTag(id, body);
  }

  @ApiOperation({ summary: '결제 태그 삭제' })
  @ApiResponse({ status: 200, type: ResponseDto })
  @Delete('/:tagId')
  async deleteFinancialRecordTag(@CurrentUser() user: IUser, @Param() param: DeleteTagReqDto) {
    const { id } = user;
    return await this.financialTagService.deleteFinancialRecordTag(id, param);
  }

  @ApiOperation({ summary: '결제 태그 순서 수정' })
  @ApiResponse({ status: 200, type: ResponseDto })
  @Patch('/order')
  async updateFinancialTagOrder(
    @CurrentUser() user: IUser,
    @Body() body: UpdateFinancialTagOrderReqDto,
  ) {
    const { id } = user;
    return await this.financialTagService.updateFinancialTagOrder(id, body);
  }
}
