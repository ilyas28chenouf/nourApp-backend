import { Injectable } from '@nestjs/common';
import { NotificationsTypeormAdapter } from '../../infrastructure/notifications/adapters/notifications-typeorm.adapter';
import { GetScheduledNotificationsUsecase } from '../../usecases/notifications/get-scheduled-notifications.usecase';
import { RegisterDeviceTokenUsecase } from '../../usecases/notifications/register-device-token.usecase';
import { SendTestNotificationUsecase } from '../../usecases/notifications/send-test-notification.usecase';

@Injectable()
export class NotificationsUsecasesProxyService {
  

  constructor(private readonly notifications: NotificationsTypeormAdapter) {}

  registerDeviceToken(userId: string, data: any) { return new RegisterDeviceTokenUsecase(this.notifications).execute(userId, data); }
  scheduled(userId: string) { return new GetScheduledNotificationsUsecase(this.notifications).execute(userId); }
  sendTest(userId: string, data: any) { return new SendTestNotificationUsecase(this.notifications).execute(userId, data); }
}
