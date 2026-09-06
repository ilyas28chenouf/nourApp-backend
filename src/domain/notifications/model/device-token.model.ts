import { DevicePlatform } from '../enums/device-platform.enum';
export interface DeviceTokenModel {
  id: string;
  userId: string;
  /** FCM registration token on both platforms; never a raw APNs or Expo token. */
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
