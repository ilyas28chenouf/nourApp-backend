import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CharityLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
