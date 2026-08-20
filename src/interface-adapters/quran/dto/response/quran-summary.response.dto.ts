import { ApiProperty } from '@nestjs/swagger';
import { CalendarPeriod } from '../../../../common-utils/dates/calendar-period.util';

export class QuranReadingPeriodSummaryResponseDto {
  @ApiProperty()
  count: number;

  @ApiProperty()
  pages: number;

  @ApiProperty()
  hizb: number;
}

export class QuranReadingPeriodsSummaryResponseDto {
  @ApiProperty({ type: QuranReadingPeriodSummaryResponseDto })
  MORNING: QuranReadingPeriodSummaryResponseDto;

  @ApiProperty({ type: QuranReadingPeriodSummaryResponseDto })
  EVENING: QuranReadingPeriodSummaryResponseDto;

  @ApiProperty({ type: QuranReadingPeriodSummaryResponseDto })
  DAY: QuranReadingPeriodSummaryResponseDto;
}

export class QuranSummaryResponseDto {
  @ApiProperty({ enum: CalendarPeriod })
  period: CalendarPeriod;

  @ApiProperty()
  from: string;

  @ApiProperty()
  to: string;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  totalHizb: number;

  @ApiProperty({ type: QuranReadingPeriodsSummaryResponseDto })
  readingPeriods: QuranReadingPeriodsSummaryResponseDto;

  @ApiProperty({ deprecated: true })
  pagesCount: number;

  @ApiProperty({ deprecated: true })
  objectivesReached: number;
}
