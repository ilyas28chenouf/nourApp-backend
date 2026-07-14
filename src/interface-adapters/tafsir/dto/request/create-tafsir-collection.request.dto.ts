import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';

export class CreateTafsirCollectionRequestDto {
  @ApiProperty({ example: 'ibn-kathir', pattern: '^[a-z0-9-]+$' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/)
  key: string;

  @ApiProperty({ example: 'Tafsir Ibn Kathir' })
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  name: string;

  @ApiPropertyOptional({ example: 'تفسير ابن كثير' })
  @IsOptional()
  @IsString()
  arabicName?: string;

  @ApiProperty({ example: 'Ibn Kathir' })
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  author: string;

  @ApiProperty({ example: 'ar' })
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  language: string;

  @ApiPropertyOptional({ example: 'A classical Quran commentary.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Verified edition' })
  @IsOptional()
  @IsString()
  sourceName?: string;

  @ApiPropertyOptional({ example: 'https://example.org/ibn-kathir' })
  @IsOptional()
  @IsUrl()
  sourceUrl?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
