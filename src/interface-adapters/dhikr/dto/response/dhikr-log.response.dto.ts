import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DhikrLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  dhikrDate: string;

  @ApiProperty()
  period: string;

  @ApiProperty()
  counter: number;

  @ApiProperty()
  completed: boolean;

  @ApiPropertyOptional()
  completedAt?: Date;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
