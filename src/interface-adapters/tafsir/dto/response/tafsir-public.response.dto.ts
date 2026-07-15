import { ApiProperty } from '@nestjs/swagger';

const tafsirCollectionExample = {
  key: 'ibn-kathir',
  name: 'Tafsir Ibn Kathir',
  arabic_name: 'تفسير ابن كثير',
  author: 'Ibn Kathir',
  language: 'ar',
  description: null,
  source_name: null,
  source_url: null,
  total_tafsirs: 20,
};

const tafsirItemExample = {
  id: 'ibn-kathir-1-1',
  collection: 'ibn-kathir',
  collection_name: 'Tafsir Ibn Kathir',
  language: 'ar',
  surah_number: 1,
  surah_name: 'Al-Fatiha',
  ayah_number: 1,
  title: null,
  content: 'Verified commentary text for this ayah.',
  source_reference: 'Volume 1, page 25',
};

export class TafsirCollectionsResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'tafsir-collections' })
  service: string;

  @ApiProperty({
    example: {
      collections: [tafsirCollectionExample],
      total_tafsirs: 20,
      fetched_at: '2026-07-14T12:00:00.000Z',
      source: 'NourApp database',
    },
  })
  data: object;

  @ApiProperty({ example: '2026-07-14T12:00:00.000Z' })
  timestamp: string;
}

export class TafsirCollectionResponseDto extends TafsirCollectionsResponseDto {
  @ApiProperty({ example: 'tafsir-collection' })
  service = 'tafsir-collection';

  @ApiProperty({ example: tafsirCollectionExample })
  data: object = {};
}

export class TafsirItemsResponseDto extends TafsirCollectionsResponseDto {
  @ApiProperty({ example: 'tafsir-collection' })
  service = 'tafsir-collection';

  @ApiProperty({
    example: {
      collection: 'ibn-kathir',
      collection_name: 'Tafsir Ibn Kathir',
      language: 'ar',
      page: 1,
      limit: 20,
      has_next_page: true,
      tafsirs: [tafsirItemExample],
    },
  })
  data: object = {};
}

export class TafsirItemResponseDto extends TafsirCollectionsResponseDto {
  @ApiProperty({ example: 'tafsir' })
  service = 'tafsir';

  @ApiProperty({ example: tafsirItemExample })
  data: object = {};
}
