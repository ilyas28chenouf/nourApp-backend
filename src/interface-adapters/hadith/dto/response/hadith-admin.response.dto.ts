import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdminHadithCollectionResponseDto {
  @ApiProperty({ example: '98b1c08e-f642-42d0-8969-79ad0f822890' })
  id: string;

  @ApiProperty({ example: 'bukhari' })
  key: string;

  @ApiProperty({ example: 'Sahih al-Bukhari' })
  name: string;

  @ApiProperty({ example: 'صحيح البخاري' })
  arabicName: string;

  @ApiProperty({ example: 'Imam Bukhari' })
  author: string;

  @ApiProperty({ example: 'Sahih', nullable: true })
  reliability: string | null;

  @ApiProperty({
    example: 'A canonical Sunni hadith collection.',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({ example: 'Verified edition', nullable: true })
  sourceName: string | null;

  @ApiProperty({ example: 'https://example.org/bukhari', nullable: true })
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

  @ApiPropertyOptional({ example: 100 })
  totalHadiths?: number;

  @ApiProperty({ example: '2026-07-14T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-07-14T12:00:00.000Z' })
  updatedAt: Date;
}

export class AdminHadithCollectionsResponseDto {
  @ApiProperty({ type: [AdminHadithCollectionResponseDto] })
  items: AdminHadithCollectionResponseDto[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 1 })
  total: number;

  @ApiProperty({ example: 1 })
  totalPages: number;
}
