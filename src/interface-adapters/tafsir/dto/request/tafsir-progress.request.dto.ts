import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateTafsirProgressRequestDto {
  @ApiProperty()
  @IsUUID()
  collectionId: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(114)
  surahNumber: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  ayahNumber: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  readDate?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateTafsirProgressRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  readDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
