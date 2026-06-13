import { Module } from '@nestjs/common';
import { FastingTypeormAdapter } from '../../infrastructure/fasting/adapters/fasting-typeorm.adapter';
import { ProgressionUsecasesProxyModule } from '../progression/progression-usecases-proxy.module';
import { FastingUsecasesProxyService } from './fasting-usecases-proxy.service';

@Module({
  imports: [ProgressionUsecasesProxyModule],
  providers: [FastingTypeormAdapter, FastingUsecasesProxyService],
  exports: [FastingUsecasesProxyService],
})
export class FastingUsecasesProxyModule {}
