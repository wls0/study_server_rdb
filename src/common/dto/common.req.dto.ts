import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    example: 1,
    description: 'page',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  page: number;

  @ApiProperty({
    example: 1,
    description: 'limit',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  limit: number;
}

export class SearchDateIntervalDto {
  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'startDate',
    required: true,
  })
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @ApiProperty({
    example: '2024-02-01T00:00:00.000Z',
    description: 'endDate',
    required: true,
  })
  @IsNotEmpty()
  @IsDate()
  endDate: Date;
}

export class PaginatedDateSearchDto {
  @ApiProperty({
    example: 1,
    description: 'page',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  page: number;

  @ApiProperty({
    example: 1,
    description: 'limit',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  limit: number;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'startDate',
    required: true,
  })
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @ApiProperty({
    example: '2024-02-01T00:00:00.000Z',
    description: 'endDate',
    required: true,
  })
  @IsNotEmpty()
  @IsDate()
  endDate: Date;
}
