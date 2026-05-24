import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { FastingStatus } from '../../../../domain/fasting/enums/fasting-status.enum'; import { FastingType } from '../../../../domain/fasting/enums/fasting-type.enum';
export class UpdateFastingLogRequestDto { @ApiPropertyOptional() @IsOptional() @IsDateString() fastingDate?: string; @ApiPropertyOptional({ enum: FastingType }) @IsOptional() @IsEnum(FastingType) fastingType?: FastingType; @ApiPropertyOptional({ enum: FastingStatus }) @IsOptional() @IsEnum(FastingStatus) status?: FastingStatus; @ApiPropertyOptional() @IsOptional() @IsString() notes?: string; }
