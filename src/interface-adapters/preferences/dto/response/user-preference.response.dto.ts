import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
