import { Module } from '@nestjs/common';
import { UsersTypeormAdapter } from '../../infrastructure/users/adapters/users-typeorm.adapter';
import { AdminUsecasesProxyService } from './admin-usecases-proxy.service';

@Module({
  providers: [UsersTypeormAdapter, AdminUsecasesProxyService],
  exports: [AdminUsecasesProxyService],
})
export class AdminUsecasesProxyModule {}
