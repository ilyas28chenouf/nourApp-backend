import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResourceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  type: string;

  @ApiPropertyOptional()
  content?: string;

  @ApiPropertyOptional()
  audioUrl?: string;

  @ApiPropertyOptional()
  imageUrl?: string;

  @ApiProperty()
  language: string;

  @ApiPropertyOptional()
  category?: string;

  @ApiPropertyOptional()
  sourceName?: string;

  @ApiPropertyOptional()
  sourceUrl?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional()
  createdBy?: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
