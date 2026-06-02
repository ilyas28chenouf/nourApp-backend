import { Injectable } from '@nestjs/common';
import { FastingTypeormAdapter } from '../../infrastructure/fasting/adapters/fasting-typeorm.adapter';
import { CreateFastingLogUsecase } from '../../usecases/fasting/create-fasting-log.usecase';
import { GetFastingLogsUsecase } from '../../usecases/fasting/get-fasting-logs.usecase';
import { GetFastingSummaryUsecase } from '../../usecases/fasting/get-fasting-summary.usecase';
import { GetRecommendedFastingDaysUsecase } from '../../usecases/fasting/get-recommended-fasting-days.usecase';
import { UpdateFastingLogUsecase } from '../../usecases/fasting/update-fasting-log.usecase';

@Injectable()
export class FastingUsecasesProxyService {
  constructor(private readonly fasting: FastingTypeormAdapter) {}

  recommendedDays(month?: string) {
    return new GetRecommendedFastingDaysUsecase(this.fasting).execute(month);
  }
  logs(userId: string, from?: string, to?: string) {
    return new GetFastingLogsUsecase(this.fasting).execute(userId, from, to);
  }
  createLog(userId: string, data: any) {
    return new CreateFastingLogUsecase(this.fasting).execute(userId, data);
  }
  updateLog(userId: string, id: string, data: any) {
    return new UpdateFastingLogUsecase(this.fasting).execute(userId, id, data);
  }
  summary(userId: string, period: string) {
    return new GetFastingSummaryUsecase(this.fasting).execute(userId, period);
  }
}
