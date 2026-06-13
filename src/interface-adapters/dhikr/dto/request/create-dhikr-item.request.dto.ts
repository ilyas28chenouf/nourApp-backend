import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { DhikrCategory } from '../../../../domain/dhikr/enums/dhikr-category.enum';

export class CreateDhikrItemRequestDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  arabicText: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transliteration?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  translation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ enum: DhikrCategory })
  @IsOptional()
  @IsEnum(DhikrCategory)
  category?: DhikrCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sourceName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sourceReference?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  recommendedCount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
