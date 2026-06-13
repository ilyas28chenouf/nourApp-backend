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
import { DhikrPeriod } from '../../../../domain/dhikr/enums/dhikr-period.enum';
import { DhikrSessionType } from '../../../../domain/dhikr/enums/dhikr-session-type.enum';
export class UpdateDhikrLogRequestDto {
  @ApiPropertyOptional() @IsOptional() @IsDateString() dhikrDate?: string;
  @ApiPropertyOptional({ enum: DhikrPeriod })
  @IsOptional()
  @IsEnum(DhikrPeriod)
  period?: DhikrPeriod;
  @ApiPropertyOptional() @IsOptional() @IsUUID() dhikrItemId?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() categoryId?: string;
  @ApiPropertyOptional({ enum: DhikrSessionType })
  @IsOptional()
  @IsEnum(DhikrSessionType)
  sessionType?: DhikrSessionType;
  @ApiPropertyOptional() @IsOptional() @IsInt() counter?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() completed?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsDateString() completedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}
