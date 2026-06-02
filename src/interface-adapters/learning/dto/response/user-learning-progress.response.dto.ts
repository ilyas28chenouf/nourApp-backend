import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserLearningProgressResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  learningItemId: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  progressPercent: number;

  @ApiPropertyOptional()
  lastReviewedAt?: Date;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
