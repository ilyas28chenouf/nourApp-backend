import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GoalResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
