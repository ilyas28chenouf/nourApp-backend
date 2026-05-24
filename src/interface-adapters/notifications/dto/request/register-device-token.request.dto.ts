import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { DevicePlatform } from '../../../../domain/notifications/enums/device-platform.enum';
export class RegisterDeviceTokenRequestDto { @ApiProperty() @IsString() token: string; @ApiProperty({ enum: DevicePlatform }) @IsEnum(DevicePlatform) platform: DevicePlatform; }
