import { Module } from '@nestjs/common';
import { DhikrTypeormAdapter } from '../../infrastructure/dhikr/adapters/dhikr-typeorm.adapter';
import { ProgressionUsecasesProxyModule } from '../progression/progression-usecases-proxy.module';
import { DhikrUsecasesProxyService } from './dhikr-usecases-proxy.service';

@Module({
  imports: [ProgressionUsecasesProxyModule],
  providers: [DhikrTypeormAdapter, DhikrUsecasesProxyService],
  exports: [DhikrUsecasesProxyService],
})
export class DhikrUsecasesProxyModule {}
