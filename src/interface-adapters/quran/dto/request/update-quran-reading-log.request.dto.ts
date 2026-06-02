import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
export class UpdateQuranReadingLogRequestDto {
  @ApiPropertyOptional() @IsOptional() @IsDateString() readingDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() pagesCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}
