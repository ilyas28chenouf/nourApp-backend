import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PrayerLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  prayerDate: string;

  @ApiProperty()
  prayerName: string;

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
  notes?: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
