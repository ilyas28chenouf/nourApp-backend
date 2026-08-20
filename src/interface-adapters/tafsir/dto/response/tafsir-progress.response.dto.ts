import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TafsirProgressResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  collectionId: string;

  @ApiProperty()
  surahNumber: number;

  @ApiProperty()
  ayahNumber: number;

  @ApiProperty()
  readDate: string;

  @ApiProperty()
  completed: boolean;

  @ApiPropertyOptional()
  notes?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
