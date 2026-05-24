import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LearningItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
