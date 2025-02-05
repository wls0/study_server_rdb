import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import {
  FindCalendarRecordDto,
  FindFinancialRecordsDto,
  FindRecordReportsByDateDto,
} from './financial-record.dto';
import { ResponseDto } from '../../common/dto/common.res.dto';

export class FindFinancialRecordsResDto extends ResponseDto {
  @ApiProperty({ description: '기록 리스트', type: FindFinancialRecordsDto })
  @Type(() => FindFinancialRecordsDto)
  body: FindFinancialRecordsDto;
}

export class FindCalendarRecordResDto extends ResponseDto {
  @ApiProperty({ description: '기록 리스트', type: FindCalendarRecordDto })
  @Type(() => FindCalendarRecordDto)
  body: FindCalendarRecordDto;
}

export class FindRecordReportsByDateResDto extends ResponseDto {
  @ApiProperty({ description: '기록 리포트', type: FindRecordReportsByDateDto })
  @Type(() => FindRecordReportsByDateDto)
  body: FindRecordReportsByDateDto;
}
