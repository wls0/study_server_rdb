import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class LoginDto {
  @ApiProperty({
    description: 'access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ2YTE4MDI1LWI3YmUtNDc5NS05ZmJjLTNmNTAzZTI5OThjNyIsInJlZnJlc2hJZCI6MSwiaWF0IjoxNzE3NjkyODU2LCJleHAiOjE3MTgyOTI4NTZ9.JpG5MMO7nS6Tf5aWhbOTDGfn3OSp9VDfZ0z81cQJgh4',
  })
  @Expose()
  accessToken: string;

  @ApiProperty({
    description: 'refresh token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ2YTE4MDI1LWI3YmUtNDc5NS05ZmJjLTNmNTAzZTI5OThjNyIsInJlZnJlc2hJZCI6MSwiaWF0IjoxNzE3NjkyODU2LCJleHAiOjE3MTgyOTI4NTZ9.JpG5MMO7nS6Tf5aWhbOTDGfn3OSp9VDfZ0z81cQJgh4',
  })
  @Expose()
  refreshToken: string;
}
