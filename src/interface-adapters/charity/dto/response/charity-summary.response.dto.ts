import { ApiProperty } from '@nestjs/swagger';
import { CalendarPeriod } from '../../../../common-utils/dates/calendar-period.util';
import { CharityActionType } from '../../../../domain/charity/enums/charity-action-type.enum';

export class CharityActionSummaryResponseDto {
  @ApiProperty({ enum: CharityActionType })
  actionType: CharityActionType;

  @ApiProperty()
  count: number;

  @ApiProperty()
  totalAmount: number;
}

export class CharitySummaryResponseDto {
  @ApiProperty({ enum: CalendarPeriod })
  period: CalendarPeriod;

  @ApiProperty()
  from: string;

  @ApiProperty()
  to: string;

  @ApiProperty()
  count: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty({ type: [CharityActionSummaryResponseDto] })
  actionTypes: CharityActionSummaryResponseDto[];
}
