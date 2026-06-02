import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class QuranReadingLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  readingDate: string;

  @ApiProperty()
  pagesCount: number;

  @ApiPropertyOptional()
  surahName?: string;

  @ApiPropertyOptional()
  surahNumber?: number;

  @ApiPropertyOptional()
  ayahFrom?: number;

  @ApiPropertyOptional()
  ayahTo?: number;

  @ApiProperty()
  hizbCount: number;

  @ApiPropertyOptional()
  readingPeriod?: string;

  @ApiProperty()
  objectiveReached: boolean;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
