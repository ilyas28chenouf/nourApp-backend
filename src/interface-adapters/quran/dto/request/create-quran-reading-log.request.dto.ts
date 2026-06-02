import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ReadingPeriod } from '../../../../domain/quran/enums/reading-period.enum';
export class CreateQuranReadingLogRequestDto {
  @ApiProperty() @IsDateString() readingDate: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() pagesCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() surahName?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() surahNumber?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() ayahFrom?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() ayahTo?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() hizbCount?: number;
  @ApiPropertyOptional({ enum: ReadingPeriod })
  @IsOptional()
  @IsEnum(ReadingPeriod)
  readingPeriod?: ReadingPeriod;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() objectiveReached?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}
