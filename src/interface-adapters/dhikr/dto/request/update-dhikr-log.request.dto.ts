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
export class UpdateDhikrLogRequestDto {
  @ApiPropertyOptional() @IsOptional() @IsDateString() dhikrDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() counter?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() completed?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}
