import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';
import { preserveInputValue } from '../../../shared/transforms/preserve-input-value.transform';

export class CreateHadithCollectionRequestDto {
  @ApiProperty({ example: 'bukhari', pattern: '^[a-z0-9-]+$' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/)
  key: string;

  @ApiProperty({ example: 'Sahih al-Bukhari' })
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  name: string;

  @ApiProperty({ example: 'صحيح البخاري' })
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  arabicName: string;

  @ApiProperty({ example: 'Imam Bukhari' })
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  author: string;

  @ApiPropertyOptional({ example: 'Sahih' })
  @IsOptional()
  @IsString()
  reliability?: string;

  @ApiPropertyOptional({ example: 'A canonical Sunni hadith collection.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Publisher or verified edition' })
  @IsOptional()
  @IsString()
  sourceName?: string;

  @ApiPropertyOptional({ example: 'https://example.org/bukhari' })
  @IsOptional()
  @IsUrl()
  sourceUrl?: string;

  @ApiPropertyOptional({ default: 0, example: 1 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    type: Boolean,
    default: true,
    example: true,
    description: 'Controls whether the collection is published to clients.',
  })
  @Transform(preserveInputValue)
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
