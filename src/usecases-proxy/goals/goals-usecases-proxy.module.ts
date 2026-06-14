import { Module } from '@nestjs/common';
import { GoalsTypeormAdapter } from '../../infrastructure/goals/adapters/goals-typeorm.adapter';
import { GroupsTypeormAdapter } from '../../infrastructure/groups/adapters/groups-typeorm.adapter';
import { GoalsUsecasesProxyService } from './goals-usecases-proxy.service';

@Module({
  providers: [
    GoalsTypeormAdapter,
    GroupsTypeormAdapter,
    GoalsUsecasesProxyService,
  ],
  exports: [GoalsUsecasesProxyService],
})
export class GoalsUsecasesProxyModule {}
