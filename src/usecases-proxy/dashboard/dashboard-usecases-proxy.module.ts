import { Module } from '@nestjs/common';

import { DashboardUsecasesProxyService } from './dashboard-usecases-proxy.service';

@Module({
  providers: [DashboardUsecasesProxyService],
  exports: [DashboardUsecasesProxyService],
})
export class DashboardUsecasesProxyModule {}
