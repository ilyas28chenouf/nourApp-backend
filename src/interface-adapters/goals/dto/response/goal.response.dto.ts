import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GoalEvaluationResponseDto } from './goal-analytics.response.dto';

export class GoalResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  ownerUserId?: string;

  @ApiPropertyOptional()
  groupId?: string;

  @ApiPropertyOptional()
  goalCode?: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional({ nullable: true })
  description?: string | null;

  @ApiProperty()
  goalType: string;

  @ApiPropertyOptional()
  targetValue?: number;

  @ApiPropertyOptional()
  targetUnit?: string;

  @ApiProperty()
  frequency: string;

  @ApiProperty()
  startDate: string;

  @ApiPropertyOptional()
  endDate?: string;

  @ApiProperty()
  isGroupGoal: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional({ type: GoalEvaluationResponseDto })
  automaticProgress?: GoalEvaluationResponseDto;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
