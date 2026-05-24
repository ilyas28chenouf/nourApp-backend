import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { LearningProgressStatus } from '../../../../domain/learning/enums/learning-progress-status.enum';
export class UpdateLearningProgressRequestDto { @ApiPropertyOptional({ enum: LearningProgressStatus }) @IsOptional() @IsEnum(LearningProgressStatus) status?: LearningProgressStatus; @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) @Max(100) progressPercent?: number; @ApiPropertyOptional() @IsOptional() @IsDateString() lastReviewedAt?: string; }
