import { BadRequestException, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { requireDateOnly } from '../../common-utils/dates/date-format.util';
import { RECOMMENDED_SURAH_NUMBERS } from '../../domain/goals/constants/goal-catalog';
import { HasanatSourceType } from '../../domain/progression/enums/hasanat-source-type.enum';
import { QuranMemorizationStatus } from '../../domain/quran/enums/quran-memorization-status.enum';
import { QuranMemorizationUnit } from '../../domain/quran/enums/quran-memorization-unit.enum';
import { ReadingPeriod } from '../../domain/quran/enums/reading-period.enum';
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
  async deleteLog(userId: string, id: string) {
    const existing = await this.quran.findLogById(id);
    if (!existing || existing.userId !== userId)
      throw new Error('Record not found');
    await this.quran.deleteLog(id);
    await this.progression.reverseEventsForLog(
      userId,
      HasanatSourceType.QURAN_READING,
      id,
      existing.readingDate,
    );
    return { deleted: true };
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
  async createMemorization(
    userId: string,
    data: any,
    timezone?: string | null,
  ) {
    const payload = this.memorizationPayload(data, timezone);
    const existing = await this.quran.findMemorizationByDate(
      userId,
      payload.memorizationDate,
    );
    if (existing) {
      return this.quran.updateMemorization(existing.id, payload);
    }
    try {
      return await this.quran.createMemorization({ ...payload, userId });
    } catch (error) {
      const concurrent = await this.quran.findMemorizationByDate(
        userId,
        payload.memorizationDate,
      );
      if (!concurrent) throw error;
      return this.quran.updateMemorization(concurrent.id, payload);
    }
  }
  async updateMemorization(userId: string, id: string, data: any) {
    const existing = (await this.quran.findMemorizationByUserId(userId)).find(
      (item: any) => item.id === id,
    );
    if (!existing) throw new Error('Record not found');
    return this.quran.updateMemorization(
      id,
      this.memorizationPayload(data, null, existing),
    );
  }

  async completeRecommendedSurah(
    userId: string,
    surahNumber: number,
    data: { readingDate?: string },
    timezone?: string | null,
  ) {
    if (!RECOMMENDED_SURAH_NUMBERS.includes(surahNumber)) {
      throw new BadRequestException('Surah is not in the recommended catalog');
    }
    const readingDate = requireDateOnly(
      data.readingDate ?? this.today(timezone),
      'readingDate',
    );
    const existing = (await this.quran.findLogsByUserId(userId)).find(
      (item) =>
        item.readingDate === readingDate &&
        item.surahNumber === surahNumber &&
        item.objectiveReached,
    );
    if (existing) return existing;

    const log = await new CreateQuranReadingLogUsecase(this.quran).execute(
      userId,
      {
        readingDate,
        pagesCount: 0,
        hizbCount: 0,
        surahNumber,
        ayahFrom: 1,
        ayahTo: 1,
        readingPeriod: ReadingPeriod.DAY,
        objectiveReached: true,
        notes: 'RECOMMENDED_SURAH_COMPLETE',
      },
    );
    await this.progression.recordQuranReadingLog(log);
    return log;
  }

  private memorizationPayload(
    data: any,
    timezone?: string | null,
    existing?: any,
  ) {
    const selectionUnit =
      data.selectionUnit ??
      existing?.selectionUnit ??
      QuranMemorizationUnit.AYAH;
    const selectionValue = Number(
      data.selectionValue ??
        existing?.selectionValue ??
        (data.ayahFrom && data.ayahTo ? data.ayahTo - data.ayahFrom + 1 : 1),
    );
    const allowed =
      selectionUnit === QuranMemorizationUnit.AYAH
        ? [1, 5, 10]
        : [0.125, 0.25, 0.5, 1];
    if (!allowed.includes(selectionValue)) {
      throw new BadRequestException('Unsupported memorization selection');
    }
    const status =
      data.status ?? existing?.status ?? QuranMemorizationStatus.MEMORIZED;
    const completed = [
      QuranMemorizationStatus.MEMORIZED,
      QuranMemorizationStatus.TO_REVIEW,
    ].includes(status);
    const completedAt = data.completedAt
      ? new Date(data.completedAt)
      : completed
        ? (existing?.completedAt ?? new Date())
        : null;

    return {
      ...data,
      memorizationDate: requireDateOnly(
        data.memorizationDate ??
          existing?.memorizationDate ??
          this.today(timezone),
        'memorizationDate',
      ),
      selectionUnit,
      selectionValue,
      status,
      completedAt,
      lastReviewedAt: data.lastReviewedAt
        ? new Date(data.lastReviewedAt)
        : completed
          ? completedAt
          : existing?.lastReviewedAt,
    };
  }

  private today(timezone?: string | null) {
    const local = timezone ? DateTime.now().setZone(timezone) : DateTime.utc();
    return (local.isValid ? local : DateTime.utc()).toISODate();
  }
}
