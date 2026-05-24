import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class QuranReadingGoalResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
