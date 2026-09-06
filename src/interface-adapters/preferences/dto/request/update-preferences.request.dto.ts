import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  Matches,
  IsString,
} from 'class-validator';
import {
  ACCEPTED_DAILY_AVAILABLE_TIMES,
  NEW_DAILY_AVAILABLE_TIMES,
} from '../../../../domain/preferences/enums/daily-available-time.enum';
import { PrayerMadhab } from '../../../../domain/users/enums/prayer-madhab.enum';
import {
  DHIKR_PRACTICES,
  ACCEPTED_MAIN_INTENTIONS,
  ACCEPTED_QURAN_PRACTICE_LEVELS,
  FASTING_PRACTICE_LEVELS,
  GLOBAL_PRACTICE_LEVELS,
  ISLAMIC_KNOWLEDGE_LEVELS,
  MAIN_INTENTIONS,
  PRAYER_PRACTICE_LEVELS,
  QURAN_PRACTICE_LEVELS,
  REGULARITY_DURATIONS,
  SOCIAL_ACTIONS_FREQUENCIES,
} from './update-onboarding-preferences.request.dto';

export class UpdatePreferencesRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  theme?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  language?: string;

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

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  activityNotificationsEnabled?: boolean;

  @ApiPropertyOptional({
    deprecated: true,
    description:
      'Retained for older clients; v1.6 does not generate encouragement notifications.',
  })
  @IsOptional()
  @IsBoolean()
  encouragementNotificationsEnabled?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  dailyReminderEnabled?: boolean;

  @ApiPropertyOptional({
    example: '09:00',
    default: '09:00',
    deprecated: true,
    description:
      'Legacy fixed-time preference; v1.6 schedules the daily reminder after Fajr.',
  })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'dailyReminderTime must be in HH:mm format',
  })
  dailyReminderTime?: string;

  @ApiPropertyOptional({ example: 'Algeria' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  prayerCalculationMethod?: string;

  @ApiPropertyOptional({ enum: PrayerMadhab, example: PrayerMadhab.SHAFI })
  @IsOptional()
  @IsEnum(PrayerMadhab)
  prayerMadhab?: PrayerMadhab;

  @ApiPropertyOptional({
    enum: NEW_DAILY_AVAILABLE_TIMES,
    description:
      'New v1.6 selections. Legacy values remain readable and accepted for compatibility.',
  })
  @IsOptional()
  @IsIn(ACCEPTED_DAILY_AVAILABLE_TIMES)
  dailyAvailableTime?: string;

  @ApiPropertyOptional({ enum: GLOBAL_PRACTICE_LEVELS })
  @IsOptional()
  @IsString()
  @IsIn(GLOBAL_PRACTICE_LEVELS)
  globalPracticeLevel?: string;

  @ApiPropertyOptional({
    enum: PRAYER_PRACTICE_LEVELS,
    isArray: true,
    description:
      'Multiple selections; legacy single answers are also accepted.',
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? [value] : value,
  )
  @IsArray()
  @IsString({ each: true })
  @IsIn(PRAYER_PRACTICE_LEVELS, { each: true })
  prayerPracticeLevel?: string[];

  @ApiPropertyOptional({
    enum: QURAN_PRACTICE_LEVELS,
    isArray: true,
    description:
      'Multiple selections; legacy single answers are also accepted.',
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? [value] : value,
  )
  @IsArray()
  @IsString({ each: true })
  @IsIn(ACCEPTED_QURAN_PRACTICE_LEVELS, { each: true })
  quranPracticeLevel?: string[];

  @ApiPropertyOptional({ enum: DHIKR_PRACTICES, isArray: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsIn(DHIKR_PRACTICES, { each: true })
  dhikrPractices?: string[];

  @ApiPropertyOptional({
    enum: FASTING_PRACTICE_LEVELS,
    isArray: true,
    description:
      'Multiple selections; legacy single answers are also accepted.',
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? [value] : value,
  )
  @IsArray()
  @IsString({ each: true })
  @IsIn(FASTING_PRACTICE_LEVELS, { each: true })
  fastingPracticeLevel?: string[];

  @ApiPropertyOptional({ enum: SOCIAL_ACTIONS_FREQUENCIES })
  @IsOptional()
  @IsString()
  @IsIn(SOCIAL_ACTIONS_FREQUENCIES)
  socialActionsFrequency?: string;

  @ApiPropertyOptional({ enum: REGULARITY_DURATIONS })
  @IsOptional()
  @IsString()
  @IsIn(REGULARITY_DURATIONS)
  regularityDuration?: string;

  @ApiPropertyOptional({ enum: ISLAMIC_KNOWLEDGE_LEVELS })
  @IsOptional()
  @IsString()
  @IsIn(ISLAMIC_KNOWLEDGE_LEVELS)
  islamicKnowledgeLevel?: string;

  @ApiPropertyOptional({ enum: MAIN_INTENTIONS, isArray: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsIn(ACCEPTED_MAIN_INTENTIONS, { each: true })
  mainIntentions?: string[];

  @ApiPropertyOptional({
    enum: MAIN_INTENTIONS,
    isArray: true,
    deprecated: true,
    description: 'Legacy key; scalar and array payloads remain accepted.',
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsString({ each: true })
  @IsIn(ACCEPTED_MAIN_INTENTIONS, { each: true })
  mainIntention?: string[];
}
