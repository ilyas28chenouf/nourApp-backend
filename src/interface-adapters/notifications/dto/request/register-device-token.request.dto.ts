import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DevicePlatform } from '../../../../domain/notifications/enums/device-platform.enum';
export class RegisterDeviceTokenRequestDto {
  @ApiProperty({
    description:
      'Firebase Cloud Messaging (FCM) registration token for both IOS and ANDROID. Raw APNs tokens and Expo push tokens are not supported. On iOS, obtain this token from the Firebase Messaging SDK; expo-notifications getDevicePushTokenAsync() returns an APNs token instead.',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    enum: DevicePlatform,
    description:
      'Device operating system. Both platforms use the FCM provider.',
  })
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
