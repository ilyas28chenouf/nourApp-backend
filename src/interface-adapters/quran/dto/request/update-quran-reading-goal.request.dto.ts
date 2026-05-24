import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { GoalFrequency } from '../../../../domain/goals/enums/goal-frequency.enum'; import { QuranGoalType } from '../../../../domain/quran/enums/quran-goal-type.enum';
export class UpdateQuranReadingGoalRequestDto { @ApiPropertyOptional() @IsOptional() @IsString() title?: string; @ApiPropertyOptional({ enum: QuranGoalType }) @IsOptional() @IsEnum(QuranGoalType) goalType?: QuranGoalType; @ApiPropertyOptional({ enum: GoalFrequency }) @IsOptional() @IsEnum(GoalFrequency) frequency?: GoalFrequency; @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean; }
