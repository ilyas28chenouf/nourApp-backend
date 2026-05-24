import { Module } from '@nestjs/common';
import { CharityTypeormAdapter } from '../../infrastructure/charity/adapters/charity-typeorm.adapter';
import { CharityUsecasesProxyService } from './charity-usecases-proxy.service';

@Module({
  providers: [CharityTypeormAdapter, CharityUsecasesProxyService],
  exports: [CharityUsecasesProxyService],
})
export class CharityUsecasesProxyModule {}
