import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WomenProgramCycleStatus } from '../../../../domain/women/enums/women-program-cycle-status.enum';

export class WomenProgramTodayResponseDto {
  @ApiProperty({ example: '2026-06-18' })
  date: string;

  @ApiProperty()
  programDay: number;

  @ApiPropertyOptional()
  isToday?: boolean;

  @ApiPropertyOptional()
  isPeriodMarked?: boolean;

  @ApiProperty()
  activitiesCompleted: number;

  @ApiProperty()
  activitiesTotal: number;
}

export class WomenProgramResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: WomenProgramCycleStatus })
  status: WomenProgramCycleStatus;

  @ApiProperty({ example: '2026-06-18' })
  startDate: string;

  @ApiPropertyOptional({ example: null, nullable: true })
  endDate: string | null;

  @ApiProperty()
  expectedDays: number;

  @ApiPropertyOptional()
  currentDay?: number;

  @ApiPropertyOptional()
  totalDays?: number;

  @ApiPropertyOptional({ type: WomenProgramTodayResponseDto })
  today?: WomenProgramTodayResponseDto;
}
