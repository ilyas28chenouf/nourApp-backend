import { ApiProperty } from '@nestjs/swagger';
import { DevicePlatform } from '../../../../domain/notifications/enums/device-platform.enum';

export class DeviceTokenResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: DevicePlatform })
  platform: DevicePlatform;

  @ApiProperty({ example: 'FCM' })
  provider: 'FCM';

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  lastSeenAt: string;
}
