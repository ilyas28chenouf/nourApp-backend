import { Module } from '@nestjs/common';
import { TafsirTypeormAdapter } from '../../infrastructure/tafsir/adapters/tafsir-typeorm.adapter';
import { TafsirUsecasesProxyService } from './tafsir-usecases-proxy.service';

@Module({
  providers: [TafsirTypeormAdapter, TafsirUsecasesProxyService],
  exports: [TafsirUsecasesProxyService],
})
export class TafsirUsecasesProxyModule {}
