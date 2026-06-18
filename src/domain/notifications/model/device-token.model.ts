import { DevicePlatform } from '../enums/device-platform.enum';
export interface DeviceTokenModel {
  id: string;
  userId: string;
  token: string;
  platform: DevicePlatform;
  provider: 'FCM';
  deviceId?: string | null;
  appVersion?: string | null;
  isActive: boolean;
  lastSeenAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
