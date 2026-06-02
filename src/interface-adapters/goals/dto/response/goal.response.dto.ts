import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GoalResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  ownerUserId?: string;

  @ApiPropertyOptional()
  groupId?: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

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

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
