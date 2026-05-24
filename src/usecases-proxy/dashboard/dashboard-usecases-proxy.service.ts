import { Injectable } from '@nestjs/common';

import { GetMonthlyDashboardUsecase } from '../../usecases/dashboard/get-monthly-dashboard.usecase';
import { GetRangeDashboardUsecase } from '../../usecases/dashboard/get-range-dashboard.usecase';
import { GetTodayDashboardUsecase } from '../../usecases/dashboard/get-today-dashboard.usecase';
import { GetWeeklyDashboardUsecase } from '../../usecases/dashboard/get-weekly-dashboard.usecase';
import { GetYearlyDashboardUsecase } from '../../usecases/dashboard/get-yearly-dashboard.usecase';

@Injectable()
export class DashboardUsecasesProxyService {
  

  constructor() {}

  today(userId: string) { return new GetTodayDashboardUsecase().execute(userId); }
  weekly(userId: string) { return new GetWeeklyDashboardUsecase().execute(userId); }
  monthly(userId: string) { return new GetMonthlyDashboardUsecase().execute(userId); }
  yearly(userId: string) { return new GetYearlyDashboardUsecase().execute(userId); }
  range(userId: string, from: string, to: string) { return new GetRangeDashboardUsecase().execute(userId, from, to); }
}
