import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GoalProgressResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
