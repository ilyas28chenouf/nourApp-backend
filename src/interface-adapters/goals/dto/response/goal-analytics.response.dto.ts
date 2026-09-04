import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CalendarPeriod } from '../../../../common-utils/dates/calendar-period.util';
import { GoalCategory } from '../../../../domain/goals/enums/goal-category.enum';
import { GoalFrequency } from '../../../../domain/goals/enums/goal-frequency.enum';

export class GoalEvaluationResponseDto {
  @ApiProperty()
  goalId: string;

  @ApiProperty()
  goalCode: string;

  @ApiPropertyOptional({ enum: GoalCategory })
  category?: GoalCategory;

  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional({ enum: GoalFrequency })
  frequency?: GoalFrequency;

  @ApiProperty()
  from: string;

  @ApiProperty()
  to: string;

  @ApiProperty()
  actual: number;

  @ApiProperty()
  target: number;

  @ApiProperty()
  percentage: number;

  @ApiProperty()
  completed: boolean;

  @ApiProperty()
  applicable: boolean;
}

export class GoalAnalyticsSummaryResponseDto {
  @ApiProperty()
  totalGoals: number;

  @ApiProperty()
  applicableGoals: number;

  @ApiProperty()
  completedGoals: number;

  @ApiProperty()
  percentage: number;
}

export class GoalCategorySummaryResponseDto extends GoalAnalyticsSummaryResponseDto {
  @ApiProperty({ enum: GoalCategory })
  category: GoalCategory;
}

export class GoalAnalyticsBucketResponseDto {
  @ApiProperty()
  key: string;

  @ApiProperty()
  label: string;

  @ApiProperty()
  from: string;

  @ApiProperty()
  to: string;

  @ApiProperty({ type: [GoalEvaluationResponseDto] })
  goals: GoalEvaluationResponseDto[];

  @ApiProperty({ type: GoalAnalyticsSummaryResponseDto })
  summary: GoalAnalyticsSummaryResponseDto;
}

export class GoalAnalyticsResponseDto {
  @ApiProperty({ enum: CalendarPeriod })
  period: CalendarPeriod;

  @ApiProperty()
  from: string;

  @ApiProperty()
  to: string;

  @ApiPropertyOptional({ enum: GoalCategory, nullable: true })
  selectedCategory: GoalCategory | null;

  @ApiProperty({ type: [GoalCategorySummaryResponseDto] })
  categorySummaries: GoalCategorySummaryResponseDto[];

  @ApiProperty({ type: [GoalEvaluationResponseDto] })
  goals: GoalEvaluationResponseDto[];

  @ApiProperty({ type: [GoalAnalyticsBucketResponseDto] })
  buckets: GoalAnalyticsBucketResponseDto[];

  @ApiProperty({ type: GoalAnalyticsSummaryResponseDto })
  summary: GoalAnalyticsSummaryResponseDto;
}
