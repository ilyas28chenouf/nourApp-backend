import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LearningItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  content: string;

  @ApiPropertyOptional()
  explanation?: string;

  @ApiPropertyOptional()
  audioUrl?: string;

  @ApiPropertyOptional()
  difficulty?: string;

  @ApiProperty()
  language: string;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
