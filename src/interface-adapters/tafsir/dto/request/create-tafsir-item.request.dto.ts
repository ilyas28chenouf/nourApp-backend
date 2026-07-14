import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateTafsirItemRequestDto {
  @ApiProperty({ example: 1, minimum: 1, maximum: 114 })
  @IsInt()
  @Min(1)
  @Max(114)
  surahNumber: number;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  ayahNumber: number;

  @ApiPropertyOptional({ example: 'Al-Fatiha' })
  @IsOptional()
  @IsString()
  surahName?: string;

  @ApiPropertyOptional({ example: 'The Opening' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'Verified commentary text for this ayah.' })
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  content: string;

  @ApiPropertyOptional({ example: 'Volume 1, page 25' })
  @IsOptional()
  @IsString()
  sourceReference?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
