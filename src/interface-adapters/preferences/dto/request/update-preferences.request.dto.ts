import { ApiPropertyOptional } from '@nestjs/swagger';
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
import { DailyAvailableTime } from '../../../../domain/preferences/enums/daily-available-time.enum';
import { PrayerMadhab } from '../../../../domain/users/enums/prayer-madhab.enum';
import {
  DHIKR_PRACTICES,
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  encouragementNotificationsEnabled?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  dailyReminderEnabled?: boolean;

  @ApiPropertyOptional({ example: '09:00', default: '09:00' })
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
    enum: DailyAvailableTime,
    description:
      '5\u201315 min: Pri\u00e8re + adhkars; 15\u201330 min: Pri\u00e8re + Coran + dhikr; 30\u201360 min: Programme complet; + 1 heure: Tahajjud, hifz',
  })
  @IsOptional()
  @IsEnum(DailyAvailableTime)
  dailyAvailableTime?: DailyAvailableTime;

  @ApiPropertyOptional({ enum: GLOBAL_PRACTICE_LEVELS })
  @IsOptional()
  @IsString()
  @IsIn(GLOBAL_PRACTICE_LEVELS)
  globalPracticeLevel?: string;

  @ApiPropertyOptional({ enum: PRAYER_PRACTICE_LEVELS })
  @IsOptional()
  @IsString()
  @IsIn(PRAYER_PRACTICE_LEVELS)
  prayerPracticeLevel?: string;

  @ApiPropertyOptional({ enum: QURAN_PRACTICE_LEVELS })
  @IsOptional()
  @IsString()
  @IsIn(QURAN_PRACTICE_LEVELS)
  quranPracticeLevel?: string;

  @ApiPropertyOptional({ enum: DHIKR_PRACTICES, isArray: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsIn(DHIKR_PRACTICES, { each: true })
  dhikrPractices?: string[];

  @ApiPropertyOptional({ enum: FASTING_PRACTICE_LEVELS })
  @IsOptional()
  @IsString()
  @IsIn(FASTING_PRACTICE_LEVELS)
  fastingPracticeLevel?: string;

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

  @ApiPropertyOptional({ enum: MAIN_INTENTIONS })
  @IsOptional()
  @IsString()
  @IsIn(MAIN_INTENTIONS)
  mainIntention?: string;
}