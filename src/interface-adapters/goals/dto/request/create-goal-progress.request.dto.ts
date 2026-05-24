import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
export class CreateGoalProgressRequestDto { @ApiProperty() @IsDateString() progressDate: string; @ApiPropertyOptional() @IsOptional() @IsNumber() value?: number; @ApiPropertyOptional() @IsOptional() @IsBoolean() completed?: boolean; @ApiPropertyOptional() @IsOptional() @IsString() notes?: string; }
