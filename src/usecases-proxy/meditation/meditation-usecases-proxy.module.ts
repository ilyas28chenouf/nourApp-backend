import { Module } from '@nestjs/common';
import { MeditationTypeormAdapter } from '../../infrastructure/meditation/adapters/meditation-typeorm.adapter';
import { MeditationUsecasesProxyService } from './meditation-usecases-proxy.service';

@Module({
  providers: [MeditationTypeormAdapter, MeditationUsecasesProxyService],
  exports: [MeditationUsecasesProxyService],
})
export class MeditationUsecasesProxyModule {}
