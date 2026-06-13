import { Module } from '@nestjs/common';
import { ProgressionUsecasesProxyModule } from '../progression/progression-usecases-proxy.module';

import { DashboardUsecasesProxyService } from './dashboard-usecases-proxy.service';

@Module({
  imports: [ProgressionUsecasesProxyModule],
  providers: [DashboardUsecasesProxyService],
  exports: [DashboardUsecasesProxyService],
})
export class DashboardUsecasesProxyModule {}
