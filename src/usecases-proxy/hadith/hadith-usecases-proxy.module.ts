import { Module } from '@nestjs/common';
import { HadithTypeormAdapter } from '../../infrastructure/hadith/adapters/hadith-typeorm.adapter';
import { HadithUsecasesProxyService } from './hadith-usecases-proxy.service';

@Module({
  providers: [HadithTypeormAdapter, HadithUsecasesProxyService],
  exports: [HadithUsecasesProxyService],
})
export class HadithUsecasesProxyModule {}
