import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PrayerSummaryResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
