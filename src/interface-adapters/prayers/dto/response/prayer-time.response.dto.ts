import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PrayerTimesValueResponseDto {
  @ApiPropertyOptional({ example: '00:48' })
  imsak?: string | null;

  @ApiProperty({ example: '00:58' })
  fajr: string;

  @ApiPropertyOptional({ example: '03:47' })
  sunrise?: string | null;

  @ApiProperty({ example: '12:57' })
  dhuhr: string;

  @ApiProperty({ example: '17:34' })
  asr: string;

  @ApiProperty({ example: '22:07' })
  maghrib: string;

  @ApiProperty({ example: '00:57' })
  isha: string;
}

export class PrayerDateTimesValueResponseDto {
  @ApiPropertyOptional({ example: '2026-06-02T00:48:00+03:00' })
  imsak?: string | null;

  @ApiPropertyOptional({ example: '2026-06-02T00:58:00+03:00' })
  fajr?: string | null;

  @ApiPropertyOptional({ example: '2026-06-02T03:47:00+03:00' })
  sunrise?: string | null;

  @ApiPropertyOptional({ example: '2026-06-02T12:57:00+03:00' })
  dhuhr?: string | null;

  @ApiPropertyOptional({ example: '2026-06-02T17:34:00+03:00' })
  asr?: string | null;

  @ApiPropertyOptional({ example: '2026-06-02T22:07:00+03:00' })
  maghrib?: string | null;

  @ApiPropertyOptional({ example: '2026-06-03T00:57:00+03:00' })
  isha?: string | null;
}

export class PrayerCurrentStatusResponseDto {
  @ApiPropertyOptional({ example: 'dhuhr' })
  currentPrayer?: string | null;

  @ApiPropertyOptional({ example: 'asr' })
  nextPrayer?: string | null;

  @ApiPropertyOptional({ example: '40 minutes' })
  timeUntilNext?: string | null;

  @ApiPropertyOptional({ example: 40 })
  minutesUntilNext?: number | null;
}

export class PrayerTimeResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: '2026-06-02' })
  prayerDate: string;

  @ApiProperty({ example: 'Europe/Moscow' })
  timezone: string;

  @ApiPropertyOptional({ example: 'Saint Petersburg' })
  city?: string | null;

  @ApiPropertyOptional({ example: 'Russia' })
  country?: string | null;

  @ApiProperty({ example: 59.9343 })
  latitude: number | string;

  @ApiProperty({ example: 30.3351 })
  longitude: number | string;

  @ApiProperty({ example: 'Algeria' })
  calculationMethod: string;

  @ApiProperty({ example: 'Shafi' })
  madhab: string;

  @ApiProperty({ type: PrayerTimesValueResponseDto })
  prayerTimes: PrayerTimesValueResponseDto;

  @ApiProperty({ type: PrayerDateTimesValueResponseDto })
  prayerDateTimes: PrayerDateTimesValueResponseDto;

  @ApiProperty({ type: PrayerCurrentStatusResponseDto })
  currentStatus: PrayerCurrentStatusResponseDto;

  @ApiProperty({ example: 'UMMAH_API' })
  source: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
