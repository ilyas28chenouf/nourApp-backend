import { Module } from '@nestjs/common';
import { UsersTypeormAdapter } from '../../infrastructure/users/adapters/users-typeorm.adapter';
import { UsersUsecasesProxyService } from './users-usecases-proxy.service';
import { NotificationsUsecasesProxyModule } from '../notifications/notifications-usecases-proxy.module';

@Module({
  imports: [NotificationsUsecasesProxyModule],
  providers: [UsersTypeormAdapter, UsersUsecasesProxyService],
  exports: [UsersUsecasesProxyService],
})
export class UsersUsecasesProxyModule {}
