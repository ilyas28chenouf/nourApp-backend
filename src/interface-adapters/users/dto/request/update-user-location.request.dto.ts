import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
export class UpdateUserLocationRequestDto { @ApiPropertyOptional() @IsOptional() @IsString() city?: string; @ApiPropertyOptional() @IsOptional() @IsString() country?: string; @ApiPropertyOptional() @IsOptional() @IsNumber() latitude?: number; @ApiPropertyOptional() @IsOptional() @IsNumber() longitude?: number; }
