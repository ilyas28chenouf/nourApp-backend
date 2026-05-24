import { Module } from '@nestjs/common';
import { LearningTypeormAdapter } from '../../infrastructure/learning/adapters/learning-typeorm.adapter';
import { LearningUsecasesProxyService } from './learning-usecases-proxy.service';

@Module({
  providers: [LearningTypeormAdapter, LearningUsecasesProxyService],
  exports: [LearningUsecasesProxyService],
})
export class LearningUsecasesProxyModule {}
