import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DhikrLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
