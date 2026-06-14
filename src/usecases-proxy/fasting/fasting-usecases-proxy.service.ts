import { Injectable } from '@nestjs/common';
import { HasanatSourceType } from '../../domain/progression/enums/hasanat-source-type.enum';
import { FastingTypeormAdapter } from '../../infrastructure/fasting/adapters/fasting-typeorm.adapter';
import { CreateFastingLogUsecase } from '../../usecases/fasting/create-fasting-log.usecase';
import { GetFastingLogsUsecase } from '../../usecases/fasting/get-fasting-logs.usecase';
import { GetFastingSummaryUsecase } from '../../usecases/fasting/get-fasting-summary.usecase';
import { GetRecommendedFastingDaysUsecase } from '../../usecases/fasting/get-recommended-fasting-days.usecase';
import { UpdateFastingLogUsecase } from '../../usecases/fasting/update-fasting-log.usecase';
import { ProgressionService } from '../progression/progression.service';

@Injectable()
export class FastingUsecasesProxyService {
  constructor(
    private readonly fasting: FastingTypeormAdapter,
    private readonly progression: ProgressionService,
  ) {}

  recommendedDays(month?: string) {
    return new GetRecommendedFastingDaysUsecase(this.fasting).execute(month);
  }
  logs(userId: string, from?: string, to?: string) {
    return new GetFastingLogsUsecase(this.fasting).execute(userId, from, to);
  }
  async createLog(userId: string, data: any) {
    const log = await new CreateFastingLogUsecase(this.fasting).execute(
      userId,
      data,
    );
    await this.progression.recordFastingLog(log);
    return log;
  }
  async updateLog(userId: string, id: string, data: any) {
    const log = await new UpdateFastingLogUsecase(this.fasting).execute(
      userId,
      id,
      data,
    );
    await this.progression.recordFastingLog(log);
    return log;
  }
  async deleteLog(userId: string, id: string) {
    const existing = await this.fasting.findLogById(id);
    if (!existing || existing.userId !== userId)
      throw new Error('Record not found');
    await this.fasting.deleteLog(id);
    await this.progression.reverseEventsForLog(
      userId,
      HasanatSourceType.FASTING,
      id,
      existing.fastingDate,
    );
    return { deleted: true };
  }
  summary(userId: string, period: string) {
    return new GetFastingSummaryUsecase(this.fasting).execute(userId, period);
  }
}
