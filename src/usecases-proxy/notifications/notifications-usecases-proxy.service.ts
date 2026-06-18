import { Injectable } from '@nestjs/common';
import { NotificationsTypeormAdapter } from '../../infrastructure/notifications/adapters/notifications-typeorm.adapter';
import { NotificationsFcmService } from '../../infrastructure/notifications/services/notifications-fcm.service';
import { GetScheduledNotificationsUsecase } from '../../usecases/notifications/get-scheduled-notifications.usecase';
import { RegisterDeviceTokenUsecase } from '../../usecases/notifications/register-device-token.usecase';
import { SendTestNotificationUsecase } from '../../usecases/notifications/send-test-notification.usecase';

@Injectable()
export class NotificationsUsecasesProxyService {
  constructor(
    private readonly notifications: NotificationsTypeormAdapter,
    private readonly fcm: NotificationsFcmService,
  ) {}

  registerDeviceToken(userId: string, data: any) {
    return new RegisterDeviceTokenUsecase(this.notifications).execute(
      userId,
      data,
    );
  }
  scheduled(userId: string, limit?: number) {
    return new GetScheduledNotificationsUsecase(this.notifications).execute(
      userId,
      limit,
    );
  }
  sendTest(userId: string) {
    return new SendTestNotificationUsecase(
      this.notifications,
      this.fcm,
    ).execute(userId);
  }
}
