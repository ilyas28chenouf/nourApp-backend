import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PrayerSummaryResponseDto {
  @ApiProperty()
  period: string;

  @ApiProperty()
  total: number;

  @ApiProperty()
  done: number;

  @ApiProperty()
  missed: number;

  @ApiProperty()
  late: number;
}
