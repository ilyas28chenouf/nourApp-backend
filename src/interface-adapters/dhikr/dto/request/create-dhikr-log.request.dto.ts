import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { DhikrPeriod } from '../../../../domain/dhikr/enums/dhikr-period.enum';
export class CreateDhikrLogRequestDto { @ApiProperty() @IsDateString() dhikrDate: string; @ApiProperty({ enum: DhikrPeriod }) @IsEnum(DhikrPeriod) period: DhikrPeriod; @ApiPropertyOptional() @IsOptional() @IsInt() counter?: number; @ApiPropertyOptional() @IsOptional() @IsBoolean() completed?: boolean; @ApiPropertyOptional() @IsOptional() @IsDateString() completedAt?: string; @ApiPropertyOptional() @IsOptional() @IsString() notes?: string; }
