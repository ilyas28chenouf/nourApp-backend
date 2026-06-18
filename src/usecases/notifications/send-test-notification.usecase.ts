import { BadRequestException } from '@nestjs/common';
import { NotificationStatus } from '../../domain/notifications/enums/notification-status.enum';
import { NotificationType } from '../../domain/notifications/enums/notification-type.enum';
import { NotificationsFcmService } from '../../infrastructure/notifications/services/notifications-fcm.service';

export class SendTestNotificationUsecase {
  constructor(
    private readonly persistence: import('../../domain/notifications/ports/notifications-persistence.port').NotificationsPersistencePort,
    private readonly fcm: NotificationsFcmService,
  ) {}
  async execute(userId: string) {
    const tokens = await this.persistence.findActiveDeviceTokensByUser(userId);
    if (tokens.length === 0) {
      throw new BadRequestException(
        'No active device token registered for this user',
      );
    }

    const notification = await this.persistence.createScheduled({
      userId,
      type: NotificationType.TEST,
      title: 'NourApp',
      body: 'Notification test reçue avec succès',
      scheduledAt: new Date(),
      status: NotificationStatus.PENDING,
      metadata: {
        screen: 'home',
      },
    });

    const result = await this.fcm.sendToTokens(tokens, {
      title: notification.title,
      body: notification.body,
      type: notification.type,
      scheduledNotificationId: notification.id,
      screen: 'home',
    });

    return result.successCount > 0
      ? this.persistence.updateScheduledStatus(
          notification.id,
          NotificationStatus.SENT,
          {
            sentAt: new Date(),
            fcmMessageId: result.messageIds[0],
          },
        )
      : this.persistence.updateScheduledStatus(
          notification.id,
          NotificationStatus.FAILED,
          {
            failureReason: result.errors.join(', ') || 'FCM send failed',
          },
        );
  }
}
