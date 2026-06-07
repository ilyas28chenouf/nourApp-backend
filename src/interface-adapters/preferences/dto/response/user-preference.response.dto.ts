import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DailyAvailableTime } from '../../../../domain/preferences/enums/daily-available-time.enum';
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
  encouragementNotificationsEnabled: boolean;

  @ApiProperty({ example: 'Algeria' })
  prayerCalculationMethod: string;

  @ApiProperty({ enum: PrayerMadhab, example: PrayerMadhab.SHAFI })
  prayerMadhab: PrayerMadhab;

  @ApiPropertyOptional({ enum: DailyAvailableTime })
  dailyAvailableTime?: DailyAvailableTime | string;

  @ApiPropertyOptional()
  globalPracticeLevel?: string;

  @ApiPropertyOptional()
  prayerPracticeLevel?: string;

  @ApiPropertyOptional()
  quranPracticeLevel?: string;

  @ApiPropertyOptional({ type: [String] })
  dhikrPractices?: string[];

  @ApiPropertyOptional()
  fastingPracticeLevel?: string;

  @ApiPropertyOptional()
  socialActionsFrequency?: string;

  @ApiPropertyOptional()
  regularityDuration?: string;

  @ApiPropertyOptional()
  islamicKnowledgeLevel?: string;

  @ApiPropertyOptional()
  mainIntention?: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
