import { ApiProperty } from '@nestjs/swagger';

const hadithCollectionExample = {
  key: 'bukhari',
  name: 'Sahih al-Bukhari',
  arabic_name: 'صحيح البخاري',
  author: 'Imam Bukhari',
  reliability: 'Sahih',
  description: null,
  source_name: null,
  source_url: null,
  total_hadiths: 100,
};

const hadithItemExample = {
  id: 'bukhari-1',
  collection: 'bukhari',
  collection_name: 'Sahih al-Bukhari',
  hadithnumber: 1,
  arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
  english: 'Actions are judged by intentions.',
  french: 'Les actes ne valent que par les intentions.',
  grade: 'Sahih',
  narrator: 'Umar ibn al-Khattab',
  chapter: 'Revelation',
  source_reference: 'Book 1, Hadith 1',
};

const hadithListItemExample = {
  id: 'bukhari-1',
  collection: 'bukhari',
  collection_name: 'Sahih al-Bukhari',
  hadithnumber: 1,
  grade: 'Sahih',
  narrator: 'Umar ibn al-Khattab',
  chapter: 'Revelation',
  source_reference: 'Book 1, Hadith 1',
};

export class HadithItemListResponseDto {
  @ApiProperty({ example: hadithListItemExample.id })
  id: string;

  @ApiProperty({ example: hadithListItemExample.collection })
  collection: string;

  @ApiProperty({ example: hadithListItemExample.collection_name })
  collection_name: string;

  @ApiProperty({ example: hadithListItemExample.hadithnumber })
  hadithnumber: number;

  @ApiProperty({ example: hadithListItemExample.grade, nullable: true })
  grade: string | null;

  @ApiProperty({ example: hadithListItemExample.narrator, nullable: true })
  narrator: string | null;

  @ApiProperty({ example: hadithListItemExample.chapter, nullable: true })
  chapter: string | null;

  @ApiProperty({
    example: hadithListItemExample.source_reference,
    nullable: true,
  })
  source_reference: string | null;
}

export class HadithItemDetailResponseDto extends HadithItemListResponseDto {
  @ApiProperty({ example: hadithItemExample.arabic })
  arabic: string;

  @ApiProperty({ example: hadithItemExample.english, nullable: true })
  english: string | null;

  @ApiProperty({ example: hadithItemExample.french, nullable: true })
  french: string | null;
}

class HadithItemsDataResponseDto {
  @ApiProperty({ example: 'bukhari' })
  collection: string;

  @ApiProperty({ example: 'Sahih al-Bukhari' })
  collection_name: string;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: true })
  has_next_page: boolean;

  @ApiProperty({
    type: [HadithItemListResponseDto],
    example: [hadithListItemExample],
  })
  hadiths: HadithItemListResponseDto[];
}

export class HadithCollectionsResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'hadith-collections' })
  service: string;

  @ApiProperty({
    example: {
      collections: [hadithCollectionExample],
      total_hadiths: 100,
      fetched_at: '2026-07-14T12:00:00.000Z',
      source: 'NourApp database',
    },
  })
  data: object;

  @ApiProperty({ example: '2026-07-14T12:00:00.000Z' })
  timestamp: string;
}

export class HadithCollectionResponseDto extends HadithCollectionsResponseDto {
  @ApiProperty({ example: 'hadith-collection' })
  service = 'hadith-collection';

  @ApiProperty({ example: hadithCollectionExample })
  data: object = {};
}

export class HadithItemsResponseDto extends HadithCollectionsResponseDto {
  @ApiProperty({ example: 'hadith-collection' })
  service = 'hadith-collection';

  @ApiProperty({
    type: HadithItemsDataResponseDto,
  })
  data: HadithItemsDataResponseDto = {} as HadithItemsDataResponseDto;
}

export class HadithItemResponseDto extends HadithCollectionsResponseDto {
  @ApiProperty({ example: 'hadith' })
  service = 'hadith';

  @ApiProperty({
    type: HadithItemDetailResponseDto,
    example: hadithItemExample,
  })
  data: HadithItemDetailResponseDto = {} as HadithItemDetailResponseDto;
}
