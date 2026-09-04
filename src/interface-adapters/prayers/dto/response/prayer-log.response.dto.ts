import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PrayerName } from '../../../../domain/prayers/enums/prayer-name.enum';

export class PrayerLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  prayerDate: string;

  @ApiProperty({ enum: PrayerName })
  prayerName: PrayerName;

  @ApiProperty()
  status: string;

  @ApiPropertyOptional()
  prayedAt?: Date;

  @ApiProperty()
  wasOnTime: boolean;

  @ApiPropertyOptional()
  prayerMode?: string;

  @ApiProperty()
  isSupererogatory: boolean;

  @ApiPropertyOptional()
  rakaat?: number;

  @ApiProperty()
  prayedAtMosque: boolean;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
