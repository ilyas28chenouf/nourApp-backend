import { ApiProperty } from '@nestjs/swagger';
import { WomenProgramDayStatus } from '../../../../domain/women/enums/women-program-day-status.enum';

export class WomenProgramDayResponseDto {
  @ApiProperty({ example: '2026-06-18' })
  date: string;

  @ApiProperty()
  programDay: number;

  @ApiProperty()
  isToday: boolean;

  @ApiProperty()
  isPeriodMarked: boolean;

  @ApiProperty()
  activitiesCompleted: number;

  @ApiProperty()
  activitiesTotal: number;

  @ApiProperty({ enum: WomenProgramDayStatus })
  status: WomenProgramDayStatus;
}
