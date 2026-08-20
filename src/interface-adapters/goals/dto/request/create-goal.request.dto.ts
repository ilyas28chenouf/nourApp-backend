import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { GoalFrequency } from '../../../../domain/goals/enums/goal-frequency.enum';
import { GoalType } from '../../../../domain/goals/enums/goal-type.enum';
export class CreateGoalRequestDto {
  @ApiPropertyOptional({
    description: 'Stable code from GET /api/goals/catalog',
  })
  @IsOptional()
  @IsString()
  goalCode?: string;

  @ApiPropertyOptional()
  @ValidateIf((value: CreateGoalRequestDto) => !value.goalCode)
  @IsString()
  title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional({ enum: GoalType })
  @ValidateIf((value: CreateGoalRequestDto) => !value.goalCode)
  @IsEnum(GoalType)
  goalType?: GoalType;
  @ApiPropertyOptional() @IsOptional() @IsNumber() targetValue?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() targetUnit?: string;
  @ApiPropertyOptional({ enum: GoalFrequency })
  @ValidateIf((value: CreateGoalRequestDto) => !value.goalCode)
  @IsEnum(GoalFrequency)
  frequency?: GoalFrequency;
  @ApiPropertyOptional()
  @ValidateIf(
    (value: CreateGoalRequestDto) =>
      !value.goalCode || value.startDate !== undefined,
  )
  @IsDateString()
  startDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() endDate?: string;
}
