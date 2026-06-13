import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { QuranMemorizationStatus } from '../../../../domain/quran/enums/quran-memorization-status.enum';

export class UpdateQuranMemorizationRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  surahNumber?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  ayahFrom?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  ayahTo?: number;

  @ApiPropertyOptional({ enum: QuranMemorizationStatus })
  @IsOptional()
  @IsEnum(QuranMemorizationStatus)
  status?: QuranMemorizationStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  lastReviewedAt?: string;
}
