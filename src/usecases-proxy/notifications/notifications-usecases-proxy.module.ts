import { Module } from '@nestjs/common';
import { FirebaseModule } from '../../infrastructure/firebase/firebase.module';
import { LoggerModule } from '../../infrastructure/logger/logger.module';
import { NotificationsTypeormAdapter } from '../../infrastructure/notifications/adapters/notifications-typeorm.adapter';
import { NotificationsFcmService } from '../../infrastructure/notifications/services/notifications-fcm.service';
import { NotificationsSchedulerService } from '../../infrastructure/notifications/services/notifications-scheduler.service';
import { UserPreferencesTypeormAdapter } from '../../infrastructure/users/adapters/user-preferences-typeorm.adapter';
import { UsersTypeormAdapter } from '../../infrastructure/users/adapters/users-typeorm.adapter';
import { NotificationsUsecasesProxyService } from './notifications-usecases-proxy.service';

@Module({
  imports: [FirebaseModule, LoggerModule],
  providers: [
    NotificationsTypeormAdapter,
    NotificationsFcmService,
    NotificationsSchedulerService,
    UsersTypeormAdapter,
    UserPreferencesTypeormAdapter,
    NotificationsUsecasesProxyService,
  ],
  exports: [NotificationsUsecasesProxyService],
})
export class NotificationsUsecasesProxyModule {}
