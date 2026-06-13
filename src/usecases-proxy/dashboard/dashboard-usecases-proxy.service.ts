import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { HasanatSourceType } from '../../domain/progression/enums/hasanat-source-type.enum';
import { DhikrLogTypeormEntity } from '../../infrastructure/dhikr/entities/dhikr-log.typeorm-entity';
import { PrayerLogTypeormEntity } from '../../infrastructure/prayers/entities/prayer-log.typeorm-entity';
import { QuranReadingLogTypeormEntity } from '../../infrastructure/quran/entities/quran-reading-log.typeorm-entity';
import { ResourceTypeormEntity } from '../../infrastructure/resources/entities/resource.typeorm-entity';
import { ProgressionService } from '../progression/progression.service';

@Injectable()
export class DashboardUsecasesProxyService {
  constructor(
    private readonly progression: ProgressionService,
    private readonly dataSource: DataSource,
  ) {}

  async today(userId: string) {
    const date = new Date().toISOString().slice(0, 10);
    const [
      progression,
      todayPointEvents,
      prayerLogs,
      quranLogs,
      dhikrLogs,
      daily,
    ] = await Promise.all([
      this.progression.getUserProgression(userId),
      this.progression.getEventsForDate(userId, date),
      this.dataSource.getRepository(PrayerLogTypeormEntity).find({
        where: { userId, prayerDate: date },
      }),
      this.dataSource.getRepository(QuranReadingLogTypeormEntity).find({
        where: { userId, readingDate: date },
      }),
      this.dataSource.getRepository(DhikrLogTypeormEntity).find({
        where: { userId, dhikrDate: date },
      }),
      this.getDailyResources(),
    ]);
    const prayerCompleted = prayerLogs.filter(
      (log) => log.status === 'DONE',
    ).length;
    const pagesRead = quranLogs.reduce(
      (sum, log) => sum + Number(log.pagesCount ?? 0),
      0,
    );
    const dhikrCompleted = dhikrLogs.filter((log) => log.completed).length;
    const totalHasanatToday = todayPointEvents.reduce(
      (sum, event) => sum + event.points,
      0,
    );

    return {
      date,
      prayerRing: {
        completed: prayerCompleted,
        target: 5,
        percent: this.percent(prayerCompleted, 5),
      },
      quranRing: {
        pagesRead,
        targetPages: 5,
        percent: this.percent(pagesRead, 5),
      },
      dhikrRing: {
        completedSessions: dhikrCompleted,
        targetSessions: 2,
        percent: this.percent(dhikrCompleted, 2),
      },
      totalHasanatToday,
      totalHasanatAllTime: progression.totalHasanat,
      currentVisibleLevel: progression.currentVisibleLevel,
      nextVisibleLevel: progression.nextVisibleLevel,
      progressToNextLevelPercent: progression.progressToNextLevelPercent,
      currentStreakDays: progression.currentStreakDays,
      todayPointEvents,
      nextPrayer: null,
      verseOfTheDay: daily.verseOfTheDay,
    };
  }
  weekly(userId: string) {
    const to = new Date();
    const from = new Date();
    from.setUTCDate(to.getUTCDate() - 6);
    return this.period(userId, from, to);
  }
  monthly(userId: string) {
    const to = new Date();
    const from = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), 1));
    return this.period(userId, from, to);
  }
  yearly(userId: string) {
    const to = new Date();
    const from = new Date(Date.UTC(to.getUTCFullYear(), 0, 1));
    return this.period(userId, from, to);
  }
  range(userId: string, from: string, to: string) {
    return this.period(
      userId,
      new Date(`${from}T00:00:00.000Z`),
      new Date(`${to}T00:00:00.000Z`),
    );
  }

  private async period(userId: string, fromDate: Date, toDate: Date) {
    const from = fromDate.toISOString().slice(0, 10);
    const to = toDate.toISOString().slice(0, 10);
    const [events, progression] = await Promise.all([
      this.progression.getEventsBetween(userId, from, to),
      this.progression.getUserProgression(userId),
    ]);
    const dailyMap = new Map<string, number>();
    const breakdown = {
      prayer: 0,
      quran: 0,
      dhikr: 0,
      fasting: 0,
      charity: 0,
    };

    for (const event of events) {
      dailyMap.set(
        event.eventDate,
        (dailyMap.get(event.eventDate) ?? 0) + event.points,
      );
      if (event.sourceType === HasanatSourceType.PRAYER)
        breakdown.prayer += event.points;
      if (
        event.sourceType === HasanatSourceType.QURAN_READING ||
        event.sourceType === HasanatSourceType.QURAN_GOAL
      )
        breakdown.quran += event.points;
      if (event.sourceType === HasanatSourceType.DHIKR)
        breakdown.dhikr += event.points;
      if (event.sourceType === HasanatSourceType.FASTING)
        breakdown.fasting += event.points;
      if (event.sourceType === HasanatSourceType.CHARITY)
        breakdown.charity += event.points;
    }

    const dailyHasanat = Array.from(dailyMap.entries()).map(
      ([date, total]) => ({
        date,
        total,
      }),
    );
    const bestDay = dailyHasanat.sort((a, b) => b.total - a.total)[0] ?? null;

    return {
      from,
      to,
      totalHasanat: events.reduce((sum, event) => sum + event.points, 0),
      dailyHasanat,
      moduleBreakdown: breakdown,
      heatmap: dailyHasanat,
      streakInfo: {
        currentStreakDays: progression.currentStreakDays,
        longestStreakDays: progression.longestStreakDays,
      },
      bestDay,
      comparisonWithPreviousPeriod: null,
    };
  }

  private percent(value: number, target: number) {
    return target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 0;
  }

  private async getDailyResources() {
    const resources = await this.dataSource
      .getRepository(ResourceTypeormEntity)
      .find({
        where: { isActive: true },
        order: { createdAt: 'DESC' },
        take: 20,
      });
    return {
      verseOfTheDay:
        resources.find((resource: any) => resource.type === 'VERSE') ?? null,
      hadithOfTheDay:
        resources.find((resource: any) => resource.type === 'HADITH') ?? null,
      wisdomOfTheDay:
        resources.find((resource: any) => resource.type === 'WISDOM') ?? null,
    };
  }
}
