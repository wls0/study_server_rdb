import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTagReqDto {
  @ApiProperty({ description: '태그 이름', example: '식비' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '태그 색상', example: '0xFFFFFFFF' })
  @IsString()
  @IsNotEmpty()
  color: string;
}

export class UpdateTagReqDto {
  @ApiProperty({ description: '태그 인덱스', example: '666408757ca7ce0026c74126', type: String })
  @IsNotEmpty()
  @IsNumber()
  tagId: number;

  @ApiProperty({ description: '태그 이름', example: '식비' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '태그 색상', example: '0xFFFFFFFF' })
  @IsString()
  @IsNotEmpty()
  color: string;
}

export class DeleteTagReqDto {
  @ApiProperty({ description: '태그 인덱스', example: '666408757ca7ce0026c74126', type: String })
  @IsNotEmpty()
  @IsNumber()
  tagId: number;
}

export class UpdateFinancialTagOrderReqDto {
  @IsNotEmpty()
  @IsArray()
  @IsNumber()
  tagIds: number[];
}
