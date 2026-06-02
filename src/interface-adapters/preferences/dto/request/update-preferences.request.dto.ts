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
export class UpdatePreferencesRequestDto {
  @ApiPropertyOptional() @IsOptional() @IsString() theme?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() language?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  prayerNotificationsEnabled?: boolean;
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  fastingNotificationsEnabled?: boolean;
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  dhikrNotificationsEnabled?: boolean;
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  quranNotificationsEnabled?: boolean;
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  encouragementNotificationsEnabled?: boolean;
}
