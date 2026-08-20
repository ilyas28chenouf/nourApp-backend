import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { GoalCategory } from '../../../../domain/goals/enums/goal-category.enum';

export class GoalCatalogQueryDto {
  @ApiPropertyOptional({ enum: GoalCategory })
  @IsOptional()
  @IsEnum(GoalCategory)
  category?: GoalCategory;
}
