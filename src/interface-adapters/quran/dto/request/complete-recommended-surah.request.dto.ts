import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class CompleteRecommendedSurahRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  readingDate?: string;
}
