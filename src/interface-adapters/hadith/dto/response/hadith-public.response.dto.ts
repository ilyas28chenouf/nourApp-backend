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
    example: {
      collection: 'bukhari',
      collection_name: 'Sahih al-Bukhari',
      page: 1,
      limit: 10,
      total: 100,
      total_pages: 10,
      hadiths: [hadithItemExample],
    },
  })
  data: object = {};
}

export class HadithItemResponseDto extends HadithCollectionsResponseDto {
  @ApiProperty({ example: 'hadith' })
  service = 'hadith';

  @ApiProperty({ example: hadithItemExample })
  data: object = {};
}
