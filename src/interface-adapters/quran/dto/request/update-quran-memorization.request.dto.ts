import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { QuranMemorizationStatus } from '../../../../domain/quran/enums/quran-memorization-status.enum';
import { QuranMemorizationUnit } from '../../../../domain/quran/enums/quran-memorization-unit.enum';

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  memorizationDate?: string;

  @ApiPropertyOptional({ enum: QuranMemorizationUnit })
  @IsOptional()
  @IsEnum(QuranMemorizationUnit)
  selectionUnit?: QuranMemorizationUnit;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0.125)
  @Max(10)
  selectionValue?: number;

  @ApiPropertyOptional({ enum: QuranMemorizationStatus })
  @IsOptional()
  @IsEnum(QuranMemorizationStatus)
  status?: QuranMemorizationStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  lastReviewedAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  completedAt?: string;
}
