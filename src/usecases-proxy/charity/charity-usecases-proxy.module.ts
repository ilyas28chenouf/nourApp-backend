import { Module } from '@nestjs/common';
import { CharityTypeormAdapter } from '../../infrastructure/charity/adapters/charity-typeorm.adapter';
import { ProgressionUsecasesProxyModule } from '../progression/progression-usecases-proxy.module';
import { CharityUsecasesProxyService } from './charity-usecases-proxy.service';

@Module({
  imports: [ProgressionUsecasesProxyModule],
  providers: [CharityTypeormAdapter, CharityUsecasesProxyService],
  exports: [CharityUsecasesProxyService],
})
export class CharityUsecasesProxyModule {}
