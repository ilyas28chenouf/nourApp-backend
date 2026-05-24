import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DhikrItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
