import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
class Tag {
  @ApiProperty({ description: '태그 인덱스', example: '666408757ca7ce0026c74126' })
  @Expose()
  id: number;

  @ApiProperty({ description: '유저 ID', example: '166408757ca7ce0026c74126' })
  @Expose()
  userId: string;

  @ApiProperty({ description: '태그 이름', example: '식비' })
  @Expose()
  name: string;

  @ApiProperty({ description: '태그 색상', example: '0xFFFFFFFF' })
  @Expose()
  color: string;

  @ApiProperty({ description: '수익 상태값', example: false })
  @Expose()
  isIncome: boolean;

  @ApiProperty({ description: '삭제된 태그 상태값', example: false })
  @Expose()
  isDeleted: boolean;

  @ApiProperty({ description: '태그 순서', example: 1 })
  @Expose()
  tagOrder: number;
}

export class FindFinancialTagsDto {
  @ApiProperty({ description: '태그 리스트', type: [Tag] })
  @Type(() => Tag)
  tags: Tag[];
}
