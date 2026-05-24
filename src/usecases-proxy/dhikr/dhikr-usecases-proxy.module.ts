import { Module } from '@nestjs/common';
import { DhikrTypeormAdapter } from '../../infrastructure/dhikr/adapters/dhikr-typeorm.adapter';
import { DhikrUsecasesProxyService } from './dhikr-usecases-proxy.service';

@Module({
  providers: [DhikrTypeormAdapter, DhikrUsecasesProxyService],
  exports: [DhikrUsecasesProxyService],
})
export class DhikrUsecasesProxyModule {}
