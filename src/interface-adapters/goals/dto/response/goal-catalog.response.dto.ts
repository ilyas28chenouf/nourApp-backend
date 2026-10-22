import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CharityActionType } from '../../../../domain/charity/enums/charity-action-type.enum';
import { GoalCategory } from '../../../../domain/goals/enums/goal-category.enum';
import { GoalFrequency } from '../../../../domain/goals/enums/goal-frequency.enum';
import { GoalDisplayMode } from '../../../../domain/goals/constants/goal-catalog';

export class GoalIndicatorTargetsResponseDto {
  @ApiPropertyOptional({ nullable: true })
  WEEK: number | null;

  @ApiPropertyOptional({ nullable: true })
  MONTH: number | null;

  @ApiPropertyOptional({ nullable: true })
  YEAR: number | null;
}

export class GoalCatalogResponseDto {
  @ApiProperty()
  code: string;

  @ApiProperty({ enum: GoalCategory })
  category: GoalCategory;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional({ nullable: true })
  description?: string | null;

  @ApiProperty()
  target: number;

  @ApiProperty()
  targetUnit: string;

  @ApiProperty({ enum: GoalFrequency })
  frequency: GoalFrequency;

  @ApiProperty({ enum: GoalDisplayMode })
  displayMode: GoalDisplayMode;

  @ApiProperty()
  sortOrder: number;

  @ApiPropertyOptional({ enum: CharityActionType })
  actionType?: CharityActionType;

  @ApiProperty({ type: GoalIndicatorTargetsResponseDto })
  indicatorTargets: GoalIndicatorTargetsResponseDto;
}
