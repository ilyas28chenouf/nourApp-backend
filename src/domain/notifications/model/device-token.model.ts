import { DevicePlatform } from '../enums/device-platform.enum';
export interface DeviceTokenModel {
  id: string;
  userId: string;
  token: string;
  platform: DevicePlatform;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
