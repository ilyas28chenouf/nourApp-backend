import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BadgeKey } from '../../domain/progression/enums/badge-key.enum';
import { HasanatSourceType } from '../../domain/progression/enums/hasanat-source-type.enum';
import { SpiritualLevel } from '../../domain/progression/enums/spiritual-level.enum';
import { HASANAT_ACTION_RULES } from '../../domain/progression/constants/hasanat-action-rules';
import { SPIRITUAL_LEVEL_THRESHOLDS } from '../../domain/progression/constants/spiritual-levels';
import { DhikrPeriod } from '../../domain/dhikr/enums/dhikr-period.enum';
import { PrayerMode } from '../../domain/prayers/enums/prayer-mode.enum';
import { PrayerName } from '../../domain/prayers/enums/prayer-name.enum';
import { PrayerStatus } from '../../domain/prayers/enums/prayer-status.enum';
import { FastingStatus } from '../../domain/fasting/enums/fasting-status.enum';
import { HasanatPointEventTypeormEntity } from '../../infrastructure/progression/entities/hasanat-point-event.typeorm-entity';
import { UserBadgeTypeormEntity } from '../../infrastructure/progression/entities/user-badge.typeorm-entity';
import { UserProgressionTypeormEntity } from '../../infrastructure/progression/entities/user-progression.typeorm-entity';
import {
  previousDateOnly,
  toSafeDateOnly,
} from '../../common-utils/dates/date-format.util';

type PointInput = {
  userId: string;
  sourceType: HasanatSourceType;
  sourceId?: string | null;
  actionKey: string;
  points: number;
  eventDate: string;
  metadata?: Record<string, unknown>;
};

@Injectable()
export class ProgressionService {
  private readonly progressions: Repository<UserProgressionTypeormEntity>;
  private readonly events: Repository<HasanatPointEventTypeormEntity>;
  private readonly badges: Repository<UserBadgeTypeormEntity>;

  constructor(dataSource: DataSource) {
    this.progressions = dataSource.getRepository(UserProgressionTypeormEntity);
    this.events = dataSource.getRepository(HasanatPointEventTypeormEntity);
    this.badges = dataSource.getRepository(UserBadgeTypeormEntity);
  }

  async getOrCreateProgression(userId: string) {
    const existing = await this.progressions.findOne({ where: { userId } });
    if (existing) return existing;

    return this.progressions.save(
      this.progressions.create({
        userId,
        totalHasanat: 0,
        currentVisibleLevel: SpiritualLevel.MURID,
        currentHiddenSubLevel: 1,
      }),
    );
  }

  async getUserProgression(userId: string, includeHidden = false) {
    const progression = await this.getOrCreateProgression(userId);
    const badges = await this.badges.find({
      where: { userId },
      order: { unlockedAt: 'DESC' },
    });
    const recentPointEvents = await this.events.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 10,
    });
    const levelState = this.getLevelState(progression.totalHasanat);

    return {
      totalHasanat: progression.totalHasanat,
      currentVisibleLevel: levelState.current.level,
      currentVisibleLevelLabel: levelState.current.label,
      nextVisibleLevel: levelState.next?.level ?? null,
      pointsToNextLevel: levelState.next
        ? Math.max(0, levelState.next.minPoints - progression.totalHasanat)
        : 0,
      progressToNextLevelPercent: levelState.progressToNextLevelPercent,
      currentStreakDays: progression.currentStreakDays,
      longestStreakDays: progression.longestStreakDays,
      badges,
      recentPointEvents,
      ...(includeHidden
        ? { currentHiddenSubLevel: progression.currentHiddenSubLevel }
        : {}),
    };
  }

  async recordPrayerLog(log: any) {
    if (log.status !== PrayerStatus.DONE) {
      await this.reverseEventsForSource(
        log.userId,
        HasanatSourceType.PRAYER,
        log.id,
        log.prayerDate,
      );
      return;
    }

    const candidates: Array<
      (typeof HASANAT_ACTION_RULES)[keyof typeof HASANAT_ACTION_RULES]
    > = [];
    if (
      log.isSupererogatory &&
      String(log.prayerName).toUpperCase() === PrayerName.TAHAJJUD
    ) {
      candidates.push(HASANAT_ACTION_RULES.TAHAJJUD);
    }
    if (log.wasOnTime)
      candidates.push(HASANAT_ACTION_RULES.PRAYER_ON_TIME_FARD);
    if (log.prayerMode === PrayerMode.GROUP_PHYSICAL)
      candidates.push(HASANAT_ACTION_RULES.PRAYER_GROUP);
    if (log.prayedAtMosque) candidates.push(HASANAT_ACTION_RULES.PRAYER_MOSQUE);

    const best = candidates.sort((a, b) => b.points - a.points)[0];
    if (!best) return;

    // MVP rule: prayer rewards use the single highest applicable score per prayer
    // to avoid double counting on-time, group, and mosque attributes.
    await this.upsertPointEvent({
      userId: log.userId,
      sourceType: HasanatSourceType.PRAYER,
      sourceId: log.id,
      actionKey: best.key,
      points: best.points,
      eventDate: log.prayerDate,
      metadata: {
        prayerName: log.prayerName,
        prayerMode: log.prayerMode,
        wasOnTime: log.wasOnTime,
        prayedAtMosque: log.prayedAtMosque,
      },
    });
  }

  async recordQuranReadingLog(log: any) {
    const pages = Number(log.pagesCount ?? 0);
    const points =
      pages * HASANAT_ACTION_RULES.QURAN_PAGE.points +
      (log.objectiveReached
        ? HASANAT_ACTION_RULES.QURAN_OBJECTIVE_REACHED.points
        : 0);

    if (points <= 0) {
      await this.reverseEventsForSource(
        log.userId,
        HasanatSourceType.QURAN_READING,
        log.id,
        log.readingDate,
      );
      return;
    }

    await this.upsertPointEvent({
      userId: log.userId,
      sourceType: HasanatSourceType.QURAN_READING,
      sourceId: log.id,
      actionKey: 'QURAN_READING_LOG',
      points,
      eventDate: log.readingDate,
      metadata: { pagesCount: pages, objectiveReached: log.objectiveReached },
    });
  }

  async recordDhikrLog(log: any) {
    if (!log.completed && Number(log.counter ?? 0) < 100) {
      await this.reverseEventsForSource(
        log.userId,
        HasanatSourceType.DHIKR,
        log.id,
        log.dhikrDate,
      );
      return;
    }

    const sessionType = String(log.sessionType ?? '').toUpperCase();
    const period = log.period;
    let rule:
      | (typeof HASANAT_ACTION_RULES)[keyof typeof HASANAT_ACTION_RULES]
      | undefined;

    if (log.completed && sessionType === 'MORNING_ADHKAR')
      rule = HASANAT_ACTION_RULES.MORNING_ADHKAR_COMPLETED;
    else if (log.completed && sessionType === 'EVENING_ADHKAR')
      rule = HASANAT_ACTION_RULES.EVENING_ADHKAR_COMPLETED;
    else if (Number(log.counter ?? 0) >= 100 && period === DhikrPeriod.MORNING)
      rule = HASANAT_ACTION_RULES.TASBIH_100_MORNING;
    else if (Number(log.counter ?? 0) >= 100 && period === DhikrPeriod.EVENING)
      rule = HASANAT_ACTION_RULES.TASBIH_100_EVENING;

    if (!rule) return;

    await this.upsertPointEvent({
      userId: log.userId,
      sourceType: HasanatSourceType.DHIKR,
      sourceId: log.id,
      actionKey: rule.key,
      points: rule.points,
      eventDate: log.dhikrDate,
      metadata: {
        period: log.period,
        counter: log.counter,
        sessionType: log.sessionType,
        dhikrItemId: log.dhikrItemId,
        categoryId: log.categoryId,
      },
    });
  }

  async recordFastingLog(log: any) {
    if (log.status !== FastingStatus.FASTED) {
      await this.reverseEventsForSource(
        log.userId,
        HasanatSourceType.FASTING,
        log.id,
        log.fastingDate,
      );
      return;
    }

    await this.upsertPointEvent({
      userId: log.userId,
      sourceType: HasanatSourceType.FASTING,
      sourceId: log.id,
      actionKey: HASANAT_ACTION_RULES.FASTING_COMPLETED.key,
      points: HASANAT_ACTION_RULES.FASTING_COMPLETED.points,
      eventDate: log.fastingDate,
      metadata: { fastingType: log.fastingType },
    });
  }

  async recordCharityLog(log: any) {
    await this.upsertPointEvent({
      userId: log.userId,
      sourceType: HasanatSourceType.CHARITY,
      sourceId: log.id,
      actionKey: HASANAT_ACTION_RULES.CHARITY_ACTION_COMPLETED.key,
      points: HASANAT_ACTION_RULES.CHARITY_ACTION_COMPLETED.points,
      eventDate: log.charityDate,
      metadata: {
        actionType: log.actionType,
        amount: log.amount,
        currency: log.currency,
      },
    });
  }

  async setAdditionalPrayerReward(input: {
    userId: string;
    prayerDate: string;
    prayerTime: string;
    eligible: boolean;
  }) {
    const time = String(input.prayerTime).toUpperCase();
    await this.upsertPointEvent({
      userId: input.userId,
      sourceType: HasanatSourceType.PRAYER,
      sourceId: null,
      actionKey: `additional_prayer:${time}:${input.userId}:${input.prayerDate}`,
      points: input.eligible ? 40 : 0,
      eventDate: input.prayerDate,
      metadata: {
        prayerTime: time,
        rewardType: 'additional_prayer',
      },
    });
  }

  async reverseEventsForLog(
    userId: string,
    sourceType: HasanatSourceType,
    sourceId: string,
    eventDate: string,
  ) {
    await this.reverseEventsForSource(userId, sourceType, sourceId, eventDate);
  }

  async getEventsForDate(userId: string, date: string) {
    return this.events.find({
      where: { userId, eventDate: date },
      order: { createdAt: 'DESC' },
    });
  }

  async getEventsBetween(userId: string, from: string, to: string) {
    return this.events
      .createQueryBuilder('event')
      .where('event.userId = :userId', { userId })
      .andWhere('event.eventDate BETWEEN :from AND :to', { from, to })
      .orderBy('event.eventDate', 'ASC')
      .getMany();
  }

  private async upsertPointEvent(input: PointInput) {
    const existing = await this.events
      .createQueryBuilder('event')
      .where('event.userId = :userId', { userId: input.userId })
      .andWhere('event.sourceType = :sourceType', {
        sourceType: input.sourceType,
      })
      .andWhere(
        input.sourceId
          ? 'event.sourceId = :sourceId'
          : 'event.sourceId IS NULL',
        { sourceId: input.sourceId },
      )
      .andWhere('event.actionKey = :actionKey', { actionKey: input.actionKey })
      .getOne();

    if (existing) {
      const delta = input.points - existing.points;
      if (delta === 0) return existing;

      existing.points = input.points;
      existing.eventDate = input.eventDate;
      existing.metadata = input.metadata ?? {};
      const saved = await this.events.save(existing);
      await this.recalculateProgression(input.userId);
      return saved;
    }

    const saved = await this.events.save(this.events.create(input));
    await this.recalculateProgression(input.userId);
    return saved;
  }

  private async reverseEventsForSource(
    userId: string,
    sourceType: HasanatSourceType,
    sourceId: string,
    eventDate: string,
  ) {
    const activeEvents = await this.events.find({
      where: { userId, sourceType, sourceId },
    });
    for (const event of activeEvents.filter((item) => item.points > 0)) {
      const reversalKey = `${event.actionKey}_REVERSAL`;
      const existingReversal = activeEvents.find(
        (item) => item.actionKey === reversalKey,
      );
      if (existingReversal) continue;
      await this.events.save(
        this.events.create({
          userId,
          sourceType,
          sourceId,
          actionKey: reversalKey,
          points: -event.points,
          eventDate,
          metadata: { reversedEventId: event.id },
        }),
      );
    }
    if (activeEvents.length) await this.recalculateProgression(userId);
  }

  private async recalculateProgression(userId: string) {
    const progression = await this.getOrCreateProgression(userId);
    const result = await this.events
      .createQueryBuilder('event')
      .select('COALESCE(SUM(event.points), 0)', 'total')
      .where('event.userId = :userId', { userId })
      .getRawOne<{ total: string }>();
    const totalHasanat = Math.max(0, Number(result?.total ?? 0));
    const streak = await this.calculateStreak(userId);
    const visibleLevel = this.getLevelForPoints(totalHasanat);

    progression.totalHasanat = totalHasanat;
    progression.currentVisibleLevel = this.nonRegressingLevel(
      progression.currentVisibleLevel,
      visibleLevel,
    );
    progression.currentHiddenSubLevel = await this.calculateHiddenSubLevel(
      userId,
      totalHasanat,
      streak.currentStreakDays,
    );
    progression.currentStreakDays = streak.currentStreakDays;
    progression.longestStreakDays = Math.max(
      progression.longestStreakDays,
      streak.currentStreakDays,
    );
    progression.lastActivityDate = streak.lastActivityDate;
    await this.progressions.save(progression);
    await this.unlockStreakBadges(userId, streak.currentStreakDays);
  }

  private async calculateStreak(userId: string) {
    const rows = await this.events
      .createQueryBuilder('event')
      .select('event.eventDate', 'date')
      .where('event.userId = :userId', { userId })
      .andWhere('event.points > 0')
      .groupBy('event.eventDate')
      .orderBy('event.eventDate', 'DESC')
      .getRawMany<{ date: string }>();

    const dates = rows
      .map((row) => toSafeDateOnly(row.date))
      .filter((date): date is string => Boolean(date));
    const today = new Date().toISOString().slice(0, 10);
    let cursor = dates[0] ?? today;
    let count = 0;
    const dateSet = new Set(dates);

    while (dateSet.has(cursor)) {
      count += 1;
      const previousDate = previousDateOnly(cursor);
      if (!previousDate) break;
      cursor = previousDate;
    }

    return {
      currentStreakDays: count,
      lastActivityDate: dates[0],
    };
  }

  private async unlockStreakBadges(userId: string, currentStreakDays: number) {
    const thresholds: Array<[BadgeKey, number]> = [
      [BadgeKey.STREAK_7, 7],
      [BadgeKey.STREAK_30, 30],
      [BadgeKey.STREAK_90, 90],
      [BadgeKey.STREAK_365, 365],
    ];

    for (const [badgeKey, days] of thresholds) {
      if (currentStreakDays < days) continue;
      const existing = await this.badges.findOne({
        where: { userId, badgeKey },
      });
      if (existing) continue;

      await this.badges.save(
        this.badges.create({
          userId,
          badgeKey,
          metadata: { streakDays: days },
        }),
      );

      if (badgeKey === BadgeKey.STREAK_7) {
        await this.upsertPointEvent({
          userId,
          sourceType: HasanatSourceType.STREAK_BONUS,
          sourceId: null,
          actionKey: HASANAT_ACTION_RULES.STREAK_7_BONUS.key,
          points: HASANAT_ACTION_RULES.STREAK_7_BONUS.points,
          eventDate: new Date().toISOString().slice(0, 10),
          metadata: { badgeKey },
        });
      }
    }
  }

  private getLevelForPoints(points: number) {
    return [...SPIRITUAL_LEVEL_THRESHOLDS]
      .reverse()
      .find((level) => points >= level.minPoints)!.level;
  }

  private nonRegressingLevel(current: SpiritualLevel, next: SpiritualLevel) {
    const currentIndex = SPIRITUAL_LEVEL_THRESHOLDS.findIndex(
      (level) => level.level === current,
    );
    const nextIndex = SPIRITUAL_LEVEL_THRESHOLDS.findIndex(
      (level) => level.level === next,
    );
    return nextIndex >= currentIndex ? next : current;
  }

  private getLevelState(points: number) {
    const current =
      [...SPIRITUAL_LEVEL_THRESHOLDS]
        .reverse()
        .find((level) => points >= level.minPoints) ??
      SPIRITUAL_LEVEL_THRESHOLDS[0];
    const currentIndex = SPIRITUAL_LEVEL_THRESHOLDS.findIndex(
      (level) => level.level === current.level,
    );
    const next = SPIRITUAL_LEVEL_THRESHOLDS[currentIndex + 1];
    const progressToNextLevelPercent = next
      ? Math.min(
          100,
          Math.round(
            ((points - current.minPoints) /
              (next.minPoints - current.minPoints)) *
              100,
          ),
        )
      : 100;

    return { current, next, progressToNextLevelPercent };
  }

  private async calculateHiddenSubLevel(
    userId: string,
    totalHasanat: number,
    currentStreakDays: number,
  ) {
    const accountAgeScore = 5;
    const varietyRows = await this.events
      .createQueryBuilder('event')
      .select('COUNT(DISTINCT event.sourceType)', 'count')
      .where('event.userId = :userId', { userId })
      .andWhere('event.points > 0')
      .getRawOne<{ count: string }>();
    const varietyScore = Number(varietyRows?.count ?? 0) * 4;
    const regularityScore = Math.min(30, currentStreakDays * 2);
    const hasanatScore = Math.min(60, Math.floor(totalHasanat / 200));

    // Deterministic v1 formula: total points provide the base, then regularity,
    // variety, and account age add small bonuses. It is intentionally simple and
    // private so future CDC tuning can replace it without changing public APIs.
    return this.clamp(
      1,
      100,
      hasanatScore + regularityScore + varietyScore + accountAgeScore,
    );
  }

  private clamp(min: number, max: number, value: number) {
    return Math.max(min, Math.min(max, value));
  }
}
