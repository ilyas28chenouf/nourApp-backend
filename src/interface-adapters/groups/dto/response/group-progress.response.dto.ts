import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GroupProgressResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  goalId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  progressDate: string;

  @ApiProperty()
  value: number;

  @ApiProperty()
  completed: boolean;

  @ApiPropertyOptional()
  notes?: string;
}
