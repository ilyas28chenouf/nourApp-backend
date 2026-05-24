import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
export class UpdateCurrentUserRequestDto { @ApiPropertyOptional() @IsOptional() @IsString() fullName?: string; @ApiPropertyOptional() @IsOptional() @IsString() phone?: string; @ApiPropertyOptional() @IsOptional() @IsString() avatarUrl?: string; @ApiPropertyOptional() @IsOptional() @IsString() language?: string; @ApiPropertyOptional() @IsOptional() @IsString() timezone?: string; }
