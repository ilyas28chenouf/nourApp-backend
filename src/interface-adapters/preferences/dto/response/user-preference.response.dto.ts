import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
