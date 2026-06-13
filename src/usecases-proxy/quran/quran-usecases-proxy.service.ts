import { Injectable } from '@nestjs/common';
import { QuranTypeormAdapter } from '../../infrastructure/quran/adapters/quran-typeorm.adapter';
import { UmmahQuranProviderService } from '../../infrastructure/external-apis/ummah/ummah-quran-provider.service';
import { CreateQuranReadingGoalUsecase } from '../../usecases/quran/create-quran-reading-goal.usecase';
import { CreateQuranReadingLogUsecase } from '../../usecases/quran/create-quran-reading-log.usecase';
import { DeleteQuranReadingGoalUsecase } from '../../usecases/quran/delete-quran-reading-goal.usecase';
import { GetQuranReadingGoalsUsecase } from '../../usecases/quran/get-quran-reading-goals.usecase';
import { GetQuranReadingLogsUsecase } from '../../usecases/quran/get-quran-reading-logs.usecase';
import { GetQuranSummaryUsecase } from '../../usecases/quran/get-quran-summary.usecase';
import { UpdateQuranReadingGoalUsecase } from '../../usecases/quran/update-quran-reading-goal.usecase';
import { UpdateQuranReadingLogUsecase } from '../../usecases/quran/update-quran-reading-log.usecase';
import { ProgressionService } from '../progression/progression.service';

@Injectable()
export class QuranUsecasesProxyService {
  constructor(
    private readonly quran: QuranTypeormAdapter,
    private readonly progression: ProgressionService,
    private readonly quranProvider: UmmahQuranProviderService,
  ) {}

  logs(userId: string, from?: string, to?: string) {
    return new GetQuranReadingLogsUsecase(this.quran).execute(userId, from, to);
  }
  async createLog(userId: string, data: any) {
    const log = await new CreateQuranReadingLogUsecase(this.quran).execute(
      userId,
      data,
    );
    await this.progression.recordQuranReadingLog(log);
    return log;
  }
  async updateLog(userId: string, id: string, data: any) {
    const log = await new UpdateQuranReadingLogUsecase(this.quran).execute(
      userId,
      id,
      data,
    );
    await this.progression.recordQuranReadingLog(log);
    return log;
  }
  goals(userId: string) {
    return new GetQuranReadingGoalsUsecase(this.quran).execute(userId);
  }
  createGoal(userId: string, data: any) {
    return new CreateQuranReadingGoalUsecase(this.quran).execute(userId, data);
  }
  updateGoal(userId: string, id: string, data: any) {
    return new UpdateQuranReadingGoalUsecase(this.quran).execute(
      userId,
      id,
      data,
    );
  }
  deleteGoal(userId: string, id: string) {
    return new DeleteQuranReadingGoalUsecase(this.quran).execute(userId, id);
  }
  summary(userId: string, period: string) {
    return new GetQuranSummaryUsecase(this.quran).execute(userId, period);
  }
  provider() {
    return this.quranProvider;
  }
  memorization(userId: string) {
    return this.quran.findMemorizationByUserId(userId);
  }
  createMemorization(userId: string, data: any) {
    return this.quran.createMemorization({ ...data, userId });
  }
  async updateMemorization(userId: string, id: string, data: any) {
    const existing = (await this.quran.findMemorizationByUserId(userId)).find(
      (item: any) => item.id === id,
    );
    if (!existing) throw new Error('Record not found');
    return this.quran.updateMemorization(id, data);
  }
}
