import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserLearningProgressResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
