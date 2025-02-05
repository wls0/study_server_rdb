import { ApiProperty } from '@nestjs/swagger';

import { LoginDto } from './auth.dto';
import { ResponseDto } from '../../common/dto/common.res.dto';

export class LoginResDto extends ResponseDto {
  @ApiProperty({
    description: 'token',
    type: LoginDto,
  })
  body: LoginDto;
}

export class RefreshResDto extends ResponseDto {
  @ApiProperty({
    description: 'token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ2YTE4MDI1LWI3YmUtNDc5NS05ZmJjLTNmNTAzZTI5OThjNyIsInJlZnJlc2hJZCI6MSwiaWF0IjoxNzE3NjkyODU2LCJleHAiOjE3MTgyOTI4NTZ9.JpG5MMO7nS6Tf5aWhbOTDGfn3OSp9VDfZ0z81cQJgh4',
  })
  token: string;
}
