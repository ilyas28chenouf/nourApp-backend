import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { CalendarPeriod } from '../../../../common-utils/dates/calendar-period.util';
import { GoalCategory } from '../../../../domain/goals/enums/goal-category.enum';

export class GoalAnalyticsQueryDto {
  @ApiPropertyOptional({ enum: GoalCategory })
  @IsOptional()
  @IsEnum(GoalCategory)
  category?: GoalCategory;

  @ApiPropertyOptional({ enum: CalendarPeriod, default: CalendarPeriod.MONTH })
  @IsOptional()
  @IsEnum(CalendarPeriod)
  period?: CalendarPeriod;

  @ApiPropertyOptional({ example: '2026-08-20' })
  @IsOptional()
  @IsDateString()
  anchor?: string;
}
