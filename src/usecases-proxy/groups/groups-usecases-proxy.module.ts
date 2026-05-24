import { Module } from '@nestjs/common';
import { GroupsTypeormAdapter } from '../../infrastructure/groups/adapters/groups-typeorm.adapter';
import { GroupsUsecasesProxyService } from './groups-usecases-proxy.service';

@Module({
  providers: [GroupsTypeormAdapter, GroupsUsecasesProxyService],
  exports: [GroupsUsecasesProxyService],
})
export class GroupsUsecasesProxyModule {}
