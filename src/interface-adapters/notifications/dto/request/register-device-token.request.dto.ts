import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DevicePlatform } from '../../../../domain/notifications/enums/device-platform.enum';
export class RegisterDeviceTokenRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ enum: DevicePlatform })
  @IsEnum(DevicePlatform)
  platform: DevicePlatform;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deviceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  appVersion?: string;
}
