import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AsmaAlHusnaTranslationResponseDto {
  @ApiProperty({ enum: ['ar', 'fr', 'en'] })
  language: 'ar' | 'fr' | 'en';

  @ApiProperty()
  translatedName: string;

  @ApiProperty()
  meaning: string;

  @ApiProperty()
  explanation: string;

  @ApiPropertyOptional()
  sourceName?: string;

  @ApiPropertyOptional()
  sourceReference?: string;
}

export class AsmaAlHusnaResponseDto {
  @ApiProperty()
  number: number;

  @ApiProperty()
  arabicName: string;

  @ApiProperty()
  transliteration: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  sortOrder: number;

  @ApiProperty({ type: [AsmaAlHusnaTranslationResponseDto] })
  translations: AsmaAlHusnaTranslationResponseDto[];
}
