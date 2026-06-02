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
import { PrayerMode } from '../../../../domain/prayers/enums/prayer-mode.enum';
import { PrayerName } from '../../../../domain/prayers/enums/prayer-name.enum';
import { PrayerStatus } from '../../../../domain/prayers/enums/prayer-status.enum';
export class UpdatePrayerLogRequestDto {
  @ApiPropertyOptional() @IsOptional() @IsDateString() prayerDate?: string;
  @ApiPropertyOptional({ enum: PrayerName })
  @IsOptional()
  @IsEnum(PrayerName)
  prayerName?: PrayerName;
  @ApiPropertyOptional({ enum: PrayerStatus })
  @IsOptional()
  @IsEnum(PrayerStatus)
  status?: PrayerStatus;
  @ApiPropertyOptional() @IsOptional() @IsDateString() prayedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() wasOnTime?: boolean;
  @ApiPropertyOptional({ enum: PrayerMode })
  @IsOptional()
  @IsEnum(PrayerMode)
  prayerMode?: PrayerMode;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isSupererogatory?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}
