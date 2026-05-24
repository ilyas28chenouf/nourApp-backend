import { Module } from '@nestjs/common';
import { FastingTypeormAdapter } from '../../infrastructure/fasting/adapters/fasting-typeorm.adapter';
import { FastingUsecasesProxyService } from './fasting-usecases-proxy.service';

@Module({
  providers: [FastingTypeormAdapter, FastingUsecasesProxyService],
  exports: [FastingUsecasesProxyService],
})
export class FastingUsecasesProxyModule {}
