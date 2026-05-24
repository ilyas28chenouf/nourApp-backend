import { Injectable } from '@nestjs/common';
import { QuranTypeormAdapter } from '../../infrastructure/quran/adapters/quran-typeorm.adapter';
import { CreateQuranReadingGoalUsecase } from '../../usecases/quran/create-quran-reading-goal.usecase';
import { CreateQuranReadingLogUsecase } from '../../usecases/quran/create-quran-reading-log.usecase';
import { DeleteQuranReadingGoalUsecase } from '../../usecases/quran/delete-quran-reading-goal.usecase';
import { GetQuranReadingGoalsUsecase } from '../../usecases/quran/get-quran-reading-goals.usecase';
import { GetQuranReadingLogsUsecase } from '../../usecases/quran/get-quran-reading-logs.usecase';
import { GetQuranSummaryUsecase } from '../../usecases/quran/get-quran-summary.usecase';
import { UpdateQuranReadingGoalUsecase } from '../../usecases/quran/update-quran-reading-goal.usecase';
import { UpdateQuranReadingLogUsecase } from '../../usecases/quran/update-quran-reading-log.usecase';

@Injectable()
export class QuranUsecasesProxyService {
  

  constructor(private readonly quran: QuranTypeormAdapter) {}

  logs(userId: string, from?: string, to?: string) { return new GetQuranReadingLogsUsecase(this.quran).execute(userId, from, to); }
  createLog(userId: string, data: any) { return new CreateQuranReadingLogUsecase(this.quran).execute(userId, data); }
  updateLog(userId: string, id: string, data: any) { return new UpdateQuranReadingLogUsecase(this.quran).execute(userId, id, data); }
  goals(userId: string) { return new GetQuranReadingGoalsUsecase(this.quran).execute(userId); }
  createGoal(userId: string, data: any) { return new CreateQuranReadingGoalUsecase(this.quran).execute(userId, data); }
  updateGoal(userId: string, id: string, data: any) { return new UpdateQuranReadingGoalUsecase(this.quran).execute(userId, id, data); }
  deleteGoal(userId: string, id: string) { return new DeleteQuranReadingGoalUsecase(this.quran).execute(userId, id); }
  summary(userId: string, period: string) { return new GetQuranSummaryUsecase(this.quran).execute(userId, period); }
}
