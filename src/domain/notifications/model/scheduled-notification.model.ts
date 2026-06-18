import { NotificationStatus } from '../enums/notification-status.enum';
import { NotificationType } from '../enums/notification-type.enum';
export interface ScheduledNotificationModel {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  scheduledAt: Date;
  sentAt?: Date | null;
  status: NotificationStatus;
  contentId?: string | null;
  fcmMessageId?: string | null;
  failureReason?: string | null;
  metadata?: Record<string, unknown> | null;
  dedupeKey?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
