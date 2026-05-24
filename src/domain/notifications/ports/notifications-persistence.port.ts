import { DeviceTokenModel } from '../model/device-token.model';
export const NOTIFICATIONS_PERSISTENCE_PORT = Symbol('NOTIFICATIONS_PERSISTENCE_PORT');
export interface NotificationsPersistencePort { findDeviceToken(userId: string, token: string): Promise<DeviceTokenModel | null>; createDeviceToken(data: Partial<DeviceTokenModel>): Promise<DeviceTokenModel>; updateDeviceToken(id: string, data: Partial<DeviceTokenModel>): Promise<DeviceTokenModel>; findScheduled(userId: string): Promise<any[]>; createScheduled(data: any): Promise<any>; }
