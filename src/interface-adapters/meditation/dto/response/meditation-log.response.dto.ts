import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MeditationLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  sessionDate: string;

  @ApiProperty()
  durationMinutes: number;

  @ApiPropertyOptional()
  concentrationLevel?: number;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
