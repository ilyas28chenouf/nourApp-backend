import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DhikrItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  arabicText: string;

  @ApiPropertyOptional()
  translation?: string;

  @ApiPropertyOptional()
  transliteration?: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  recommendedCount: number;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
