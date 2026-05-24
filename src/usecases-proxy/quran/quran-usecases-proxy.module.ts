import { Module } from '@nestjs/common';
import { QuranTypeormAdapter } from '../../infrastructure/quran/adapters/quran-typeorm.adapter';
import { QuranUsecasesProxyService } from './quran-usecases-proxy.service';

@Module({
  providers: [QuranTypeormAdapter, QuranUsecasesProxyService],
  exports: [QuranUsecasesProxyService],
})
export class QuranUsecasesProxyModule {}
