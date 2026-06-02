import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PrayerTimeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  prayerDate: string;

  @ApiProperty()
  fajrTime: Date;

  @ApiProperty()
  dhuhrTime: Date;

  @ApiProperty()
  asrTime: Date;

  @ApiProperty()
  maghribTime: Date;

  @ApiProperty()
  ishaTime: Date;

  @ApiProperty()
  source: string;

  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional()
  country?: string;

  @ApiPropertyOptional()
  createdAt?: Date;
}
