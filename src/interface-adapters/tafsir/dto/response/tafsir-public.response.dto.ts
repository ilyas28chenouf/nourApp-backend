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

const tafsirListItemExample = {
  id: 'ibn-kathir-1-1',
  collection: 'ibn-kathir',
  collection_name: 'Tafsir Ibn Kathir',
  language: 'ar',
  surah_number: 1,
  surah_name: 'Al-Fatiha',
  ayah_number: 1,
  title: null,
  source_reference: 'Volume 1, page 25',
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

export class TafsirItemListResponseDto {
  @ApiProperty({ example: tafsirListItemExample.id })
  id: string;

  @ApiProperty({ example: tafsirListItemExample.collection })
  collection: string;

  @ApiProperty({ example: tafsirListItemExample.collection_name })
  collection_name: string;

  @ApiProperty({ example: tafsirListItemExample.language })
  language: string;

  @ApiProperty({ example: tafsirListItemExample.surah_number })
  surah_number: number;

  @ApiProperty({ example: tafsirListItemExample.surah_name, nullable: true })
  surah_name: string | null;

  @ApiProperty({ example: tafsirListItemExample.ayah_number })
  ayah_number: number;

  @ApiProperty({ example: tafsirListItemExample.title, nullable: true })
  title: string | null;

  @ApiProperty({
    example: tafsirListItemExample.source_reference,
    nullable: true,
  })
  source_reference: string | null;
}

export class TafsirItemDetailResponseDto extends TafsirItemListResponseDto {
  @ApiProperty({ example: tafsirItemExample.content })
  content: string;
}

class TafsirItemsDataResponseDto {
  @ApiProperty({ example: 'ibn-kathir' })
  collection: string;

  @ApiProperty({ example: 'Tafsir Ibn Kathir' })
  collection_name: string;

  @ApiProperty({ example: 'ar' })
  language: string;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: true })
  has_next_page: boolean;

  @ApiProperty({
    type: [TafsirItemListResponseDto],
    example: [tafsirListItemExample],
  })
  tafsirs: TafsirItemListResponseDto[];
}

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
    type: TafsirItemsDataResponseDto,
  })
  data: TafsirItemsDataResponseDto = {} as TafsirItemsDataResponseDto;
}

export class TafsirItemResponseDto extends TafsirCollectionsResponseDto {
  @ApiProperty({ example: 'tafsir' })
  service = 'tafsir';

  @ApiProperty({
    type: TafsirItemDetailResponseDto,
    example: tafsirItemExample,
  })
  data: TafsirItemDetailResponseDto = {} as TafsirItemDetailResponseDto;
}
