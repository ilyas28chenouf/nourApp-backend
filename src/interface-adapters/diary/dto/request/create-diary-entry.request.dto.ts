import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { DiaryEntryType } from '../../../../domain/diary/enums/diary-entry-type.enum';

export class CreateDiaryEntryRequestDto {
  @ApiPropertyOptional({ example: '2026-06-14' })
  @IsOptional()
  @IsDateString()
  entryDate?: string;

  @ApiProperty({ enum: DiaryEntryType })
  @IsEnum(DiaryEntryType)
  type: DiaryEntryType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  feeling?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiPropertyOptional({ type: [String], default: [] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
