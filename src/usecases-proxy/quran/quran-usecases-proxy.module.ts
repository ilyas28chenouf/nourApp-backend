import { Module } from '@nestjs/common';
import { UmmahQuranProviderService } from '../../infrastructure/external-apis/ummah/ummah-quran-provider.service';
import { QuranTypeormAdapter } from '../../infrastructure/quran/adapters/quran-typeorm.adapter';
import { ProgressionUsecasesProxyModule } from '../progression/progression-usecases-proxy.module';
import { QuranUsecasesProxyService } from './quran-usecases-proxy.service';

@Module({
  imports: [ProgressionUsecasesProxyModule],
  providers: [
    QuranTypeormAdapter,
    UmmahQuranProviderService,
    QuranUsecasesProxyService,
  ],
  exports: [QuranUsecasesProxyService],
})
export class QuranUsecasesProxyModule {}
