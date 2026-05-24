import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GroupProgressResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
