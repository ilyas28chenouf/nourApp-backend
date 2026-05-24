import { Module } from '@nestjs/common';
import { ResourcesTypeormAdapter } from '../../infrastructure/resources/adapters/resources-typeorm.adapter';
import { ResourcesUsecasesProxyService } from './resources-usecases-proxy.service';

@Module({
  providers: [ResourcesTypeormAdapter, ResourcesUsecasesProxyService],
  exports: [ResourcesUsecasesProxyService],
})
export class ResourcesUsecasesProxyModule {}
