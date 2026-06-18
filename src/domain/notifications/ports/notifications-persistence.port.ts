import { DeviceTokenModel } from '../model/device-token.model';
import { ScheduledNotificationModel } from '../model/scheduled-notification.model';
import { NotificationStatus } from '../enums/notification-status.enum';
export const NOTIFICATIONS_PERSISTENCE_PORT = Symbol(
  'NOTIFICATIONS_PERSISTENCE_PORT',
);
export interface NotificationsPersistencePort {
  findDeviceTokenByToken(token: string): Promise<DeviceTokenModel | null>;
  createDeviceToken(data: Partial<DeviceTokenModel>): Promise<DeviceTokenModel>;
  updateDeviceToken(
    id: string,
    data: Partial<DeviceTokenModel>,
  ): Promise<DeviceTokenModel>;
  findActiveDeviceTokensByUser(userId: string): Promise<DeviceTokenModel[]>;
  deactivateDeviceToken(id: string): Promise<void>;
  findScheduled(
    userId: string,
    limit?: number,
  ): Promise<ScheduledNotificationModel[]>;
  createScheduled(
    data: Partial<ScheduledNotificationModel>,
  ): Promise<ScheduledNotificationModel>;
  updateScheduled(
    id: string,
    data: Partial<ScheduledNotificationModel>,
  ): Promise<ScheduledNotificationModel>;
  findDueScheduled(limit: number): Promise<ScheduledNotificationModel[]>;
  findScheduledByDedupeKey(
    dedupeKey: string,
  ): Promise<ScheduledNotificationModel | null>;
  updateScheduledStatus(
    id: string,
    status: NotificationStatus,
    data?: Partial<ScheduledNotificationModel>,
  ): Promise<ScheduledNotificationModel>;
}
