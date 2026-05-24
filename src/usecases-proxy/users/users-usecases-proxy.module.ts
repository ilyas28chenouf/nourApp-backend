import { Module } from '@nestjs/common';
import { UsersTypeormAdapter } from '../../infrastructure/users/adapters/users-typeorm.adapter';
import { UsersUsecasesProxyService } from './users-usecases-proxy.service';

@Module({
  providers: [UsersTypeormAdapter, UsersUsecasesProxyService],
  exports: [UsersUsecasesProxyService],
})
export class UsersUsecasesProxyModule {}
