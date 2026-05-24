import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MeditationLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
