import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class QuranReadingGoalResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  goalType: string;

  @ApiPropertyOptional()
  targetPages?: number;

  @ApiPropertyOptional()
  targetSurah?: string;

  @ApiPropertyOptional()
  targetHizb?: number;

  @ApiProperty()
  frequency: string;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
