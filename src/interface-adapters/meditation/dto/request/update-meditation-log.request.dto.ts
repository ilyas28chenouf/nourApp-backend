import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
export class UpdateMeditationLogRequestDto { @ApiPropertyOptional() @IsOptional() @IsDateString() sessionDate?: string; @ApiPropertyOptional() @IsOptional() @IsInt() durationMinutes?: number; @ApiPropertyOptional() @IsOptional() @IsInt() concentrationLevel?: number; @ApiPropertyOptional() @IsOptional() @IsString() notes?: string; }
