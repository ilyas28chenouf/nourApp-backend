import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { QuranMemorizationStatus } from '../../../../domain/quran/enums/quran-memorization-status.enum';

export class CreateQuranMemorizationRequestDto {
  @ApiProperty()
  @IsInt()
  surahNumber: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  ayahFrom?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  ayahTo?: number;

  @ApiProperty({ enum: QuranMemorizationStatus })
  @IsEnum(QuranMemorizationStatus)
  status: QuranMemorizationStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  lastReviewedAt?: string;
}
