import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PrayerMadhab } from '../../../../domain/users/enums/prayer-madhab.enum';

export class UpdatePreferencesRequestDto {
  @ApiPropertyOptional() @IsOptional() @IsString() theme?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() language?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  prayerNotificationsEnabled?: boolean;
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  fastingNotificationsEnabled?: boolean;
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  dhikrNotificationsEnabled?: boolean;
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  quranNotificationsEnabled?: boolean;
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  encouragementNotificationsEnabled?: boolean;

  @ApiPropertyOptional({ example: 'Algeria' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  prayerCalculationMethod?: string;

  @ApiPropertyOptional({ enum: PrayerMadhab, example: PrayerMadhab.SHAFI })
  @IsOptional()
  @IsEnum(PrayerMadhab)
  prayerMadhab?: PrayerMadhab;
}
