import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { LearningProgressStatus } from '../../../../domain/learning/enums/learning-progress-status.enum';
export class CreateLearningItemRequestDto {
  @ApiProperty() @IsUUID() learningItemId: string;
  @ApiProperty({ enum: LearningProgressStatus })
  @IsEnum(LearningProgressStatus)
  status: LearningProgressStatus;
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progressPercent?: number;
  @ApiPropertyOptional() @IsOptional() @IsDateString() lastReviewedAt?: string;
}
