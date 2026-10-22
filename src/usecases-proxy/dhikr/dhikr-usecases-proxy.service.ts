import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { DhikrPeriod } from '../../domain/dhikr/enums/dhikr-period.enum';
import { HasanatSourceType } from '../../domain/progression/enums/hasanat-source-type.enum';
import { DhikrTypeormAdapter } from '../../infrastructure/dhikr/adapters/dhikr-typeorm.adapter';
import { CreateDhikrLogUsecase } from '../../usecases/dhikr/create-dhikr-log.usecase';
import { GetDhikrItemsUsecase } from '../../usecases/dhikr/get-dhikr-items.usecase';
import { GetDhikrLogsUsecase } from '../../usecases/dhikr/get-dhikr-logs.usecase';
import { UpdateDhikrLogUsecase } from '../../usecases/dhikr/update-dhikr-log.usecase';
import { ProgressionService } from '../progression/progression.service';
import { PrayersUsecasesProxyService } from '../prayers/prayers-usecases-proxy.service';

@Injectable()
export class DhikrUsecasesProxyService {
  constructor(
    private readonly dhikr: DhikrTypeormAdapter,
    private readonly progression: ProgressionService,
    private readonly prayers: PrayersUsecasesProxyService,
  ) {}

  items(filters?: any) {
    return this.dhikr.findItems(filters);
  }
  categories() {
    return this.dhikr.findCategories();
  }
  itemsByCategorySlug(slug: string) {
    return this.dhikr.findItemsByCategorySlug(slug);
  }
  createCategory(data: any) {
    return this.dhikr.createCategory(data);
  }
  updateCategory(id: string, data: any) {
    return this.dhikr.updateCategory(id, data);
  }
  deleteCategory(id: string) {
    return this.dhikr.deleteCategory(id);
  }
  createItem(data: any) {
    return this.dhikr.createItem(data);
  }
  updateItem(id: string, data: any) {
    return this.dhikr.updateItem(id, data);
  }
  deleteItem(id: string) {
    return this.dhikr.deleteItem(id);
  }
  logs(userId: string, date?: string) {
    return new GetDhikrLogsUsecase(this.dhikr).execute(userId, date);
  }
  async createLog(userId: string, data: any) {
    const normalized = await this.normalizePeriod(userId, data);
    const log = await new CreateDhikrLogUsecase(this.dhikr).execute(
      userId,
      normalized,
    );
    await this.progression.recordDhikrLog(log);
    return log;
  }
  async updateLog(userId: string, id: string, data: any) {
    const existing = await this.dhikr.findLogById(id);
    if (!existing || existing.userId !== userId)
      throw new Error('Record not found');
    const normalized = await this.normalizePeriod(userId, {
      ...existing,
      ...data,
    });
    const log = await new UpdateDhikrLogUsecase(this.dhikr).execute(
      userId,
      id,
      normalized,
    );
    await this.progression.recordDhikrLog(log);
    return log;
  }
  async deleteLog(userId: string, id: string) {
    const existing = await this.dhikr.findLogById(id);
    if (!existing || existing.userId !== userId)
      throw new Error('Record not found');
    await this.dhikr.deleteLog(id);
    await this.progression.reverseEventsForLog(
      userId,
      HasanatSourceType.DHIKR,
      id,
      existing.dhikrDate,
    );
    return { deleted: true };
  }

  private async normalizePeriod(userId: string, data: any) {
    const completedAt = data.completedAt
      ? DateTime.fromISO(String(data.completedAt))
      : data.completed
        ? DateTime.now()
        : null;
    if (!completedAt?.isValid) return data;

    try {
      const dhikrDate = data.dhikrDate ?? completedAt.toISODate();
      const times = await this.prayers.getPrayerTimes(userId, dhikrDate);
      const zone = times.timezone || completedAt.zoneName || 'UTC';
      const instant = completedAt.setZone(zone);
      const fajr = this.prayerInstant(
        times.fajrDateTime,
        times.fajr,
        dhikrDate,
        zone,
      );
      const dhuhr = this.prayerInstant(
        times.dhuhrDateTime,
        times.dhuhr,
        dhikrDate,
        zone,
      );
      const asr = this.prayerInstant(
        times.asrDateTime,
        times.asr,
        dhikrDate,
        zone,
      );
      const isha = this.prayerInstant(
        times.ishaDateTime,
        times.isha,
        dhikrDate,
        zone,
      );
      const period =
        instant >= fajr && instant < dhuhr
          ? DhikrPeriod.MORNING
          : instant >= asr && instant < isha
            ? DhikrPeriod.EVENING
            : data.period;
      return {
        ...data,
        completedAt: completedAt.toISO(),
        period,
      };
    } catch {
      return {
        ...data,
        completedAt: completedAt.toISO(),
      };
    }
  }

  private prayerInstant(
    dateTime: string | null | undefined,
    time: string,
    date: string,
    zone: string,
  ) {
    const parsedDateTime = dateTime
      ? DateTime.fromISO(dateTime, { setZone: true }).setZone(zone)
      : null;
    if (parsedDateTime?.isValid) return parsedDateTime;
    const [hour, minute] = time.split(':').map(Number);
    return DateTime.fromISO(date, { zone }).set({ hour, minute, second: 0 });
  }
}
