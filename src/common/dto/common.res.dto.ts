import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty({
    example: 200,
    description: 'code',
  })
  code: number;

  @ApiProperty({
    example: 'success',
    description: 'message',
  })
  message: string;
}
