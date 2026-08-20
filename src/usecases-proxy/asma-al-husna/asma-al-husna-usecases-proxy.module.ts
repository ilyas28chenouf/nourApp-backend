import { Module } from '@nestjs/common';
import { AsmaAlHusnaTypeormAdapter } from '../../infrastructure/asma-al-husna/adapters/asma-al-husna-typeorm.adapter';
import { AsmaAlHusnaUsecasesProxyService } from './asma-al-husna-usecases-proxy.service';

@Module({
  providers: [AsmaAlHusnaTypeormAdapter, AsmaAlHusnaUsecasesProxyService],
  exports: [AsmaAlHusnaUsecasesProxyService],
})
export class AsmaAlHusnaUsecasesProxyModule {}
