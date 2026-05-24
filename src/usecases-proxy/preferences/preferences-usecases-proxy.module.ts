import { Module } from '@nestjs/common';
import { UserPreferencesTypeormAdapter } from '../../infrastructure/users/adapters/user-preferences-typeorm.adapter';
import { PreferencesUsecasesProxyService } from './preferences-usecases-proxy.service';

@Module({
  providers: [UserPreferencesTypeormAdapter, PreferencesUsecasesProxyService],
  exports: [PreferencesUsecasesProxyService],
})
export class PreferencesUsecasesProxyModule {}
