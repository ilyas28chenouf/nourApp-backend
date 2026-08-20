import { Module } from '@nestjs/common';
import { UserPreferencesTypeormAdapter } from '../../infrastructure/users/adapters/user-preferences-typeorm.adapter';
import { PreferencesUsecasesProxyService } from './preferences-usecases-proxy.service';
import { NotificationsUsecasesProxyModule } from '../notifications/notifications-usecases-proxy.module';

@Module({
  imports: [NotificationsUsecasesProxyModule],
  providers: [UserPreferencesTypeormAdapter, PreferencesUsecasesProxyService],
  exports: [PreferencesUsecasesProxyService],
})
export class PreferencesUsecasesProxyModule {}
