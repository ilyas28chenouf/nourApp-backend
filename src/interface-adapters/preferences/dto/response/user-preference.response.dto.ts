import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NEW_DAILY_AVAILABLE_TIMES } from '../../../../domain/preferences/enums/daily-available-time.enum';
import { MainIntention } from '../../../../domain/preferences/enums/main-intention.enum';
import { PrayerMadhab } from '../../../../domain/users/enums/prayer-madhab.enum';

export class UserPreferenceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  theme: string;

  @ApiProperty()
  language: string;

  @ApiProperty()
  prayerNotificationsEnabled: boolean;

  @ApiProperty()
  fastingNotificationsEnabled: boolean;

  @ApiProperty()
  dhikrNotificationsEnabled: boolean;

  @ApiProperty()
  quranNotificationsEnabled: boolean;

  @ApiProperty()
  activityNotificationsEnabled: boolean;

  @ApiProperty({ deprecated: true })
  encouragementNotificationsEnabled: boolean;

  @ApiProperty()
  dailyReminderEnabled: boolean;

  @ApiProperty({ example: '09:00', deprecated: true })
  dailyReminderTime: string;

  @ApiPropertyOptional()
  dailyReminderCycleStartDate?: string;

  @ApiProperty({ example: 'Algeria' })
  prayerCalculationMethod: string;

  @ApiProperty({ enum: PrayerMadhab, example: PrayerMadhab.SHAFI })
  prayerMadhab: PrayerMadhab;

  @ApiPropertyOptional({ enum: NEW_DAILY_AVAILABLE_TIMES })
  dailyAvailableTime?: string;

  @ApiPropertyOptional()
  globalPracticeLevel?: string;

  @ApiPropertyOptional({ type: [String] })
  prayerPracticeLevel?: string[];

  @ApiPropertyOptional({ type: [String] })
  quranPracticeLevel?: string[];

  @ApiPropertyOptional({ type: [String] })
  dhikrPractices?: string[];

  @ApiPropertyOptional({ type: [String] })
  fastingPracticeLevel?: string[];

  @ApiPropertyOptional()
  socialActionsFrequency?: string;

  @ApiPropertyOptional()
  regularityDuration?: string;

  @ApiPropertyOptional()
  islamicKnowledgeLevel?: string;

  @ApiPropertyOptional({ deprecated: true })
  mainIntention?: string;

  @ApiPropertyOptional({ enum: MainIntention, isArray: true })
  mainIntentions?: string[];

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
