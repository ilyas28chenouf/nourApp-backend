import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersTypeormAdapter } from '../../infrastructure/users/adapters/users-typeorm.adapter';
import { UserPreferencesTypeormAdapter } from '../../infrastructure/users/adapters/user-preferences-typeorm.adapter';
import { AuthUsecasesProxyService } from './auth-usecases-proxy.service';

@Module({
  providers: [UsersTypeormAdapter, UserPreferencesTypeormAdapter, AuthUsecasesProxyService],
  exports: [AuthUsecasesProxyService],
})
export class AuthUsecasesProxyModule {}
