import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AdditionalPrayerTime } from '../../domain/prayers/enums/additional-prayer-time.enum';
import { HasanatSourceType } from '../../domain/progression/enums/hasanat-source-type.enum';
import { UmmahPrayersClient } from '../../infrastructure/external-apis/ummah/ummah-prayers.client';
import { PrayerLogsTypeormAdapter } from '../../infrastructure/prayers/adapters/prayer-logs-typeorm.adapter';
import { PrayerTimesTypeormAdapter } from '../../infrastructure/prayers/adapters/prayer-times-typeorm.adapter';
import { AdditionalPrayerLogTypeormEntity } from '../../infrastructure/prayers/entities/additional-prayer-log.typeorm-entity';
import { UserPreferencesTypeormAdapter } from '../../infrastructure/users/adapters/user-preferences-typeorm.adapter';
import { UsersTypeormAdapter } from '../../infrastructure/users/adapters/users-typeorm.adapter';
import { CreatePrayerLogUsecase } from '../../usecases/prayers/create-prayer-log.usecase';
import { GetPrayerLogsUsecase } from '../../usecases/prayers/get-prayer-logs.usecase';
import { GetPrayerMethodsUsecase } from '../../usecases/prayers/get-prayer-methods.usecase';
import { GetPrayerSummaryUsecase } from '../../usecases/prayers/get-prayer-summary.usecase';
import { GetPrayerTimesUsecase } from '../../usecases/prayers/get-prayer-times.usecase';
import { UpdatePrayerLogUsecase } from '../../usecases/prayers/update-prayer-log.usecase';
import { ProgressionService } from '../progression/progression.service';

@Injectable()
export class PrayersUsecasesProxyService {
  private readonly additionalLogs: Repository<AdditionalPrayerLogTypeormEntity>;

  constructor(
    private readonly times: PrayerTimesTypeormAdapter,
    private readonly logs: PrayerLogsTypeormAdapter,
    private readonly users: UsersTypeormAdapter,
    private readonly preferences: UserPreferencesTypeormAdapter,
    private readonly provider: UmmahPrayersClient,
    private readonly progression: ProgressionService,
    dataSource: DataSource,
  ) {
    this.additionalLogs = dataSource.getRepository(
      AdditionalPrayerLogTypeormEntity,
    );
  }

  getPrayerTimes(userId: string, date: string) {
    return new GetPrayerTimesUsecase(
      this.times,
      this.users,
      this.preferences,
      this.provider,
    ).execute(userId, date);
  }
  getPrayerMethods() {
    return new GetPrayerMethodsUsecase(this.provider).execute();
  }
  getPrayerLogs(userId: string, from?: string, to?: string) {
    return new GetPrayerLogsUsecase(this.logs).execute(userId, from, to);
  }
  async createPrayerLog(userId: string, data: any) {
    const log = await new CreatePrayerLogUsecase(this.logs).execute(
      userId,
      data,
    );
    await this.progression.recordPrayerLog(log);
    return log;
  }
  async updatePrayerLog(userId: string, id: string, data: any) {
    const log = await new UpdatePrayerLogUsecase(this.logs).execute(
      userId,
      id,
      data,
    );
    await this.progression.recordPrayerLog(log);
    return log;
  }
  async deletePrayerLog(userId: string, id: string) {
    const existing = await this.logs.findById(id);
    if (!existing || existing.userId !== userId)
      throw new Error('Record not found');
    await this.logs.delete(id);
    await this.progression.reverseEventsForLog(
      userId,
      HasanatSourceType.PRAYER,
      id,
      existing.prayerDate,
    );
    return { deleted: true };
  }
  getPrayerSummary(userId: string, period: string) {
    return new GetPrayerSummaryUsecase(this.logs).execute(userId, period);
  }

  listAdditional(userId: string, from?: string, to?: string) {
    const qb = this.additionalLogs
      .createQueryBuilder('log')
      .where('log.userId = :userId', { userId })
      .orderBy('log.prayerDate', 'DESC')
      .addOrderBy('log.createdAt', 'DESC');
    if (from) qb.andWhere('log.prayerDate >= :from', { from });
    if (to) qb.andWhere('log.prayerDate <= :to', { to });
    return qb.getMany();
  }

  async getAdditional(userId: string, id: string) {
    const log = await this.additionalLogs.findOne({ where: { id, userId } });
    if (!log) throw new Error('Record not found');
    return log;
  }

  async createAdditional(userId: string, data: any) {
    const payload: Partial<AdditionalPrayerLogTypeormEntity> = {
      prayerDate: data.prayerDate,
      prayerTime: data.prayerTime,
      rakaat: data.rakaat,
      userId,
    };
    const log = await this.additionalLogs.save(
      this.additionalLogs.create(payload),
    );
    await this.recalculateAdditionalReward(
      userId,
      log.prayerDate,
      log.prayerTime,
    );
    return log;
  }

  async updateAdditional(userId: string, id: string, data: any) {
    const existing = await this.getAdditional(userId, id);
    const oldDate = existing.prayerDate;
    const oldTime = existing.prayerTime;
    const log = await this.additionalLogs.save({
      ...existing,
      ...this.stripUndefined(data),
    });
    await this.recalculateAdditionalReward(userId, oldDate, oldTime);
    await this.recalculateAdditionalReward(
      userId,
      log.prayerDate,
      log.prayerTime,
    );
    return log;
  }

  async deleteAdditional(userId: string, id: string) {
    const existing = await this.getAdditional(userId, id);
    await this.additionalLogs.delete(existing.id);
    await this.recalculateAdditionalReward(
      userId,
      existing.prayerDate,
      existing.prayerTime,
    );
    return { deleted: true };
  }

  private async recalculateAdditionalReward(
    userId: string,
    prayerDate: string,
    prayerTime: AdditionalPrayerTime,
  ) {
    const result = await this.additionalLogs
      .createQueryBuilder('log')
      .select('COALESCE(SUM(log.rakaat), 0)', 'total')
      .where('log.userId = :userId', { userId })
      .andWhere('log.prayerDate = :prayerDate', { prayerDate })
      .andWhere('log.prayerTime = :prayerTime', { prayerTime })
      .getRawOne<{ total: string }>();

    await this.progression.setAdditionalPrayerReward({
      userId,
      prayerDate,
      prayerTime,
      rakaat: Number(result?.total ?? 0),
    });
  }

  private stripUndefined(data: Record<string, unknown>) {
    return Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    );
  }
}
