import { Module } from '@nestjs/common';
import { NotificationsTypeormAdapter } from '../../infrastructure/notifications/adapters/notifications-typeorm.adapter';
import { NotificationsUsecasesProxyService } from './notifications-usecases-proxy.service';

@Module({
  providers: [NotificationsTypeormAdapter, NotificationsUsecasesProxyService],
  exports: [NotificationsUsecasesProxyService],
})
export class NotificationsUsecasesProxyModule {}
