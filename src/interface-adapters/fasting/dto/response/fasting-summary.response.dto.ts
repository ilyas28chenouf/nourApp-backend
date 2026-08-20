import { ApiProperty } from '@nestjs/swagger';
import { CalendarPeriod } from '../../../../common-utils/dates/calendar-period.util';

export class FastingSummarySectionResponseDto {
  @ApiProperty()
  applicable: boolean;

  @ApiProperty()
  available: number;

  @ApiProperty()
  fasted: number;

  @ApiProperty()
  percentage: number;
}

export class FastingSummaryResponseDto {
  @ApiProperty({ enum: CalendarPeriod })
  period: CalendarPeriod;

  @ApiProperty()
  from: string;

  @ApiProperty()
  to: string;

  @ApiProperty()
  totalFasted: number;

  @ApiProperty({ type: FastingSummarySectionResponseDto })
  mondayThursday: FastingSummarySectionResponseDto;

  @ApiProperty({ type: FastingSummarySectionResponseDto })
  whiteDays: FastingSummarySectionResponseDto;

  @ApiProperty({ type: FastingSummarySectionResponseDto })
  otherSunnah: FastingSummarySectionResponseDto;

  @ApiProperty({ deprecated: true })
  total: number;

  @ApiProperty({ deprecated: true })
  fasted: number;

  @ApiProperty({ deprecated: true })
  planned: number;
}
