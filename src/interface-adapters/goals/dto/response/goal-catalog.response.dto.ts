import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CharityActionType } from '../../../../domain/charity/enums/charity-action-type.enum';
import { GoalCategory } from '../../../../domain/goals/enums/goal-category.enum';
import { GoalFrequency } from '../../../../domain/goals/enums/goal-frequency.enum';

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

  @ApiProperty()
  sortOrder: number;

  @ApiPropertyOptional({ enum: CharityActionType })
  actionType?: CharityActionType;
}
