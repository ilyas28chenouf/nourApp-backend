import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdminTafsirCollectionResponseDto {
  @ApiProperty({ example: 'c3139fa9-fe15-4a06-b788-a67d4e91dac3' })
  id: string;

  @ApiProperty({ example: 'ibn-kathir' })
  key: string;

  @ApiProperty({ example: 'Tafsir Ibn Kathir' })
  name: string;

  @ApiProperty({ example: 'تفسير ابن كثير', nullable: true })
  arabicName: string | null;

  @ApiProperty({ example: 'Ibn Kathir' })
  author: string;

  @ApiProperty({ example: 'ar' })
  language: string;

  @ApiProperty({ example: 'A classical Quran commentary.', nullable: true })
  description: string | null;

  @ApiProperty({ example: 'Verified edition', nullable: true })
  sourceName: string | null;

  @ApiProperty({ example: 'https://example.org/ibn-kathir', nullable: true })
  sourceUrl: string | null;

  @ApiProperty({ example: 1 })
  sortOrder: number;

  @ApiProperty({
    example: true,
    description: 'Controls whether the collection record is active.',
  })
  isActive: boolean;

  @ApiProperty({
    example: true,
    description: 'Controls whether the collection is published to clients.',
  })
  published: boolean;

  @ApiPropertyOptional({ example: 20 })
  totalTafsirs?: number;

  @ApiProperty({ example: '2026-07-14T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-07-14T12:00:00.000Z' })
  updatedAt: Date;
}

export class AdminTafsirCollectionsResponseDto {
  @ApiProperty({ type: [AdminTafsirCollectionResponseDto] })
  items: AdminTafsirCollectionResponseDto[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 1 })
  total: number;

  @ApiProperty({ example: 1 })
  totalPages: number;
}
