import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { GoalFrequency } from '../../../../domain/goals/enums/goal-frequency.enum';
import { GoalType } from '../../../../domain/goals/enums/goal-type.enum';
export class CreateGoalRequestDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty({ enum: GoalType }) @IsEnum(GoalType) goalType: GoalType;
  @ApiPropertyOptional() @IsOptional() @IsNumber() targetValue?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() targetUnit?: string;
  @ApiProperty({ enum: GoalFrequency })
  @IsEnum(GoalFrequency)
  frequency: GoalFrequency;
  @ApiProperty() @IsDateString() startDate: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() endDate?: string;
}
