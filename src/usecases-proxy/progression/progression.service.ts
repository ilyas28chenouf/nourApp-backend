import { Injectable } from '@nestjs/common';
import { DataSource, IsNull, Repository } from 'typeorm';
import {
  calculateObligatoryPrayerPoints,
  calculateQuranReadingPoints,
  calculateSupererogatoryPrayerPoints,
  HASANAT_ACTION_RULES,
} from '../../domain/progression/constants/hasanat-action-rules';
import {
  calculateSpiritualLevelProgress,
  SPIRITUAL_LEVEL_CATALOG,
  SPIRITUAL_PROGRESSION_COMPLETION_POINTS,
} from '../../domain/progression/constants/spiritual-levels';
import { BadgeKey } from '../../domain/progression/enums/badge-key.enum';
import { HasanatSourceType } from '../../domain/progression/enums/hasanat-source-type.enum';
import { SpiritualLevel } from '../../domain/progression/enums/spiritual-level.enum';
import { DhikrSessionType } from '../../domain/dhikr/enums/dhikr-session-type.enum';
import { PrayerName } from '../../domain/prayers/enums/prayer-name.enum';
import { PrayerStatus } from '../../domain/prayers/enums/prayer-status.enum';
import { FastingStatus } from '../../domain/fasting/enums/fasting-status.enum';
import type { CharityLogModel } from '../../domain/charity/model/charity-log.model';
import type { DhikrLogModel } from '../../domain/dhikr/model/dhikr-log.model';
import type { FastingLogModel } from '../../domain/fasting/model/fasting-log.model';
import type { AdditionalPrayerLogModel } from '../../domain/prayers/model/additional-prayer-log.model';
import type { PrayerLogModel } from '../../domain/prayers/model/prayer-log.model';
import type { QuranReadingLogModel } from '../../domain/quran/model/quran-reading-log.model';
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
  sourceId: string | null;
  actionKey: string;
  points: number;
  eventDate: string;
  metadata?: Record<string, unknown>;
};

type AdditionalPrayerRewardInput = Pick<
  AdditionalPrayerLogModel,
  'userId' | 'prayerDate' | 'prayerTime' | 'rakaat'
>;

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
        currentVisibleLevel: SpiritualLevel.EVEIL_SERVITEUR_D_ALLAH,
      }),
    );
  }

  async getUserProgression(userId: string, includeCatalogMetadata = false) {
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
    const levelState = calculateSpiritualLevelProgress(
      progression.totalHasanat,
    );

    return {
      totalHasanat: progression.totalHasanat,
      currentLevelNumber: levelState.current.order,
      totalVisibleLevels: SPIRITUAL_LEVEL_CATALOG.length,
      currentPoints: levelState.currentPoints,
      targetPoints: levelState.targetPoints,
      currentVisibleLevel: levelState.current.level,
      currentVisibleLevelLabel: levelState.current.label,
      nextVisibleLevel: levelState.next?.level ?? null,
      pointsToNextLevel: levelState.pointsToNextLevel,
      progressToNextLevelPercent: levelState.progressToNextLevelPercent,
      isCompleted: levelState.isCompleted,
      currentStreakDays: progression.currentStreakDays,
      longestStreakDays: progression.longestStreakDays,
      badges,
      recentPointEvents,
      ...(includeCatalogMetadata
        ? {
            currentLevelDefinition: levelState.current,
            nextLevelDefinition: levelState.next,
            completionTargetPoints: SPIRITUAL_PROGRESSION_COMPLETION_POINTS,
          }
        : {}),
    };
  }

  async recordPrayerLog(log: PrayerLogModel) {
    const completed =
      log.status === PrayerStatus.DONE || log.status === PrayerStatus.LATE;
    let points = 0;
    let qualifiedRuleKey: string | null = null;
    const isSupererogatory =
      log.isSupererogatory || log.prayerName === PrayerName.TAHAJJUD;

    if (completed && isSupererogatory) {
      points = calculateSupererogatoryPrayerPoints(log.rakaat);
      if (points > 0) {
        qualifiedRuleKey = HASANAT_ACTION_RULES.SUPEREROGATORY_PRAYER_RAKAH.key;
      }
    } else if (completed) {
      const wasOnTime =
        log.status === PrayerStatus.DONE && Boolean(log.wasOnTime);
      points = calculateObligatoryPrayerPoints(wasOnTime);
      qualifiedRuleKey = wasOnTime
        ? HASANAT_ACTION_RULES.PRAYER_ON_TIME_FARD.key
        : HASANAT_ACTION_RULES.PRAYER_LATE_FARD.key;
    }

    await this.setSourcePointContribution({
      userId: log.userId,
      sourceType: HasanatSourceType.PRAYER,
      sourceId: log.id,
      actionKey: this.contributionActionKey(HasanatSourceType.PRAYER),
      points,
      eventDate: log.prayerDate,
      metadata: {
        qualifiedRuleKey,
        prayerName: log.prayerName,
        prayerMode: log.prayerMode,
        wasOnTime: log.wasOnTime,
        prayedAtMosque: log.prayedAtMosque,
        isSupererogatory,
        rakaat: log.rakaat ?? null,
      },
    });
  }

  async setAdditionalPrayerReward(log: AdditionalPrayerRewardInput) {
    await this.setSourcePointContribution({
      userId: log.userId,
      sourceType: HasanatSourceType.PRAYER,
      sourceId: null,
      actionKey: `additional_prayer:${log.prayerTime}:${log.userId}:${log.prayerDate}`,
      points: calculateSupererogatoryPrayerPoints(log.rakaat),
      eventDate: log.prayerDate,
      metadata: {
        qualifiedRuleKey: HASANAT_ACTION_RULES.SUPEREROGATORY_PRAYER_RAKAH.key,
        prayerTime: log.prayerTime,
        rakaat: log.rakaat,
        rewardType: 'additional_prayer',
      },
    });
  }

  async recordQuranReadingLog(log: QuranReadingLogModel) {
    const pages = Number(log.pagesCount ?? 0);
    const hizb = Number(log.hizbCount ?? 0);
    const points = calculateQuranReadingPoints({
      pagesCount: pages,
      hizbCount: hizb,
    });

    await this.setSourcePointContribution({
      userId: log.userId,
      sourceType: HasanatSourceType.QURAN_READING,
      sourceId: log.id,
      actionKey: this.contributionActionKey(HasanatSourceType.QURAN_READING),
      points,
      eventDate: log.readingDate,
      metadata: {
        pagesCount: pages,
        hizbCount: hizb,
        rewardedUnit: pages > 0 ? 'page' : hizb > 0 ? 'hizb' : null,
        objectiveReached: log.objectiveReached,
      },
    });
  }

  async recordDhikrLog(log: DhikrLogModel) {
    let points = 0;
    let qualifiedRuleKey: string | null = null;

    if (log.completed && log.sessionType === DhikrSessionType.MORNING_ADHKAR) {
      points = HASANAT_ACTION_RULES.MORNING_ADHKAR_COMPLETED.points;
      qualifiedRuleKey = HASANAT_ACTION_RULES.MORNING_ADHKAR_COMPLETED.key;
    } else if (
      log.completed &&
      log.sessionType === DhikrSessionType.EVENING_ADHKAR
    ) {
      points = HASANAT_ACTION_RULES.EVENING_ADHKAR_COMPLETED.points;
      qualifiedRuleKey = HASANAT_ACTION_RULES.EVENING_ADHKAR_COMPLETED.key;
    }

    await this.setSourcePointContribution({
      userId: log.userId,
      sourceType: HasanatSourceType.DHIKR,
      sourceId: log.id,
      actionKey: this.contributionActionKey(HasanatSourceType.DHIKR),
      points,
      eventDate: log.dhikrDate,
      metadata: {
        qualifiedRuleKey,
        period: log.period,
        counter: log.counter,
        sessionType: log.sessionType,
        dhikrItemId: log.dhikrItemId,
        categoryId: log.categoryId,
      },
    });
  }

  async recordFastingLog(log: FastingLogModel) {
    const points =
      log.status === FastingStatus.FASTED
        ? HASANAT_ACTION_RULES.FASTING_COMPLETED.points
        : 0;

    await this.setSourcePointContribution({
      userId: log.userId,
      sourceType: HasanatSourceType.FASTING,
      sourceId: log.id,
      actionKey: this.contributionActionKey(HasanatSourceType.FASTING),
      points,
      eventDate: log.fastingDate,
      metadata: {
        qualifiedRuleKey:
          points > 0 ? HASANAT_ACTION_RULES.FASTING_COMPLETED.key : null,
        fastingType: log.fastingType,
        status: log.status,
      },
    });
  }

  async recordCharityLog(log: CharityLogModel) {
    await this.setSourcePointContribution({
      userId: log.userId,
      sourceType: HasanatSourceType.CHARITY,
      sourceId: log.id,
      actionKey: this.contributionActionKey(HasanatSourceType.CHARITY),
      points: HASANAT_ACTION_RULES.CHARITY_ACTION_COMPLETED.points,
      eventDate: log.charityDate,
      metadata: {
        qualifiedRuleKey: HASANAT_ACTION_RULES.CHARITY_ACTION_COMPLETED.key,
        actionType: log.actionType,
        amount: log.amount,
        currency: log.currency,
      },
    });
  }

  async reverseEventsForLog(
    userId: string,
    sourceType: HasanatSourceType,
    sourceId: string,
    eventDate: string,
  ) {
    await this.setSourcePointContribution({
      userId,
      sourceType,
      sourceId,
      actionKey: this.contributionActionKey(sourceType),
      points: 0,
      eventDate,
      metadata: { removed: true },
    });
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

  private async setSourcePointContribution(input: PointInput) {
    const allSourceEvents = await this.events.find({
      where: {
        userId: input.userId,
        sourceType: input.sourceType,
        sourceId: input.sourceId ?? IsNull(),
      },
    });
    const reversalActionKey = `${input.actionKey}_REVERSAL`;
    const sourceEvents =
      input.sourceId === null
        ? allSourceEvents.filter(
            (event) =>
              event.actionKey === input.actionKey ||
              event.actionKey === reversalActionKey,
          )
        : allSourceEvents;
    const contributionEvent = sourceEvents.find(
      (event) => event.actionKey === input.actionKey,
    );
    const reversalEvent = sourceEvents.find(
      (event) => event.actionKey === reversalActionKey,
    );
    const priorPoints = sourceEvents
      .filter(
        (event) =>
          event.id !== contributionEvent?.id && event.id !== reversalEvent?.id,
      )
      .reduce((sum, event) => sum + event.points, 0);

    if (
      input.points === 0 &&
      !contributionEvent &&
      !reversalEvent &&
      priorPoints === 0
    ) {
      return;
    }

    if (input.points > 0) {
      const reconciledPoints = input.points - priorPoints;
      const event = contributionEvent
        ? Object.assign(contributionEvent, {
            points: reconciledPoints,
            eventDate: input.eventDate,
            metadata: {
              ...input.metadata,
              targetContribution: input.points,
              reconcilesPriorPoints: priorPoints,
            },
          })
        : this.events.create({
            ...input,
            points: reconciledPoints,
            metadata: {
              ...input.metadata,
              targetContribution: input.points,
              reconcilesPriorPoints: priorPoints,
            },
          });
      const saved = await this.events.save(event);

      if (reversalEvent) {
        reversalEvent.points = 0;
        reversalEvent.eventDate = input.eventDate;
        reversalEvent.metadata = {
          reactivated: true,
          contributionActionKey: input.actionKey,
        };
        await this.events.save(reversalEvent);
      }

      await this.recalculateProgression(input.userId);
      return saved;
    }

    if (contributionEvent) {
      contributionEvent.eventDate = input.eventDate;
      await this.events.save(contributionEvent);
    }
    const pointsBeforeReversal = priorPoints + (contributionEvent?.points ?? 0);
    const event = reversalEvent
      ? Object.assign(reversalEvent, {
          points: -pointsBeforeReversal,
          eventDate: input.eventDate,
          metadata: {
            ...input.metadata,
            contributionActionKey: input.actionKey,
            reconcilesPriorPoints: priorPoints,
          },
        })
      : this.events.create({
          userId: input.userId,
          sourceType: input.sourceType,
          sourceId: input.sourceId,
          actionKey: reversalActionKey,
          points: -pointsBeforeReversal,
          eventDate: input.eventDate,
          metadata: {
            ...input.metadata,
            contributionActionKey: input.actionKey,
            reconcilesPriorPoints: priorPoints,
          },
        });

    const saved = await this.events.save(event);
    await this.recalculateProgression(input.userId);
    return saved;
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
    const visibleLevel =
      calculateSpiritualLevelProgress(totalHasanat).current.level;

    progression.totalHasanat = totalHasanat;
    progression.currentVisibleLevel = visibleLevel;
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
      .addSelect('SUM(event.points)', 'total')
      .where('event.userId = :userId', { userId })
      .groupBy('event.eventDate')
      .having('SUM(event.points) > 0')
      .orderBy('event.eventDate', 'DESC')
      .getRawMany<{ date: string; total: string }>();

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
    }
  }

  private contributionActionKey(sourceType: HasanatSourceType) {
    switch (sourceType) {
      case HasanatSourceType.PRAYER:
        return 'PRAYER_LOG_CONTRIBUTION';
      case HasanatSourceType.QURAN_READING:
        return 'QURAN_READING_LOG';
      case HasanatSourceType.DHIKR:
        return 'DHIKR_LOG_CONTRIBUTION';
      case HasanatSourceType.FASTING:
        return HASANAT_ACTION_RULES.FASTING_COMPLETED.key;
      case HasanatSourceType.CHARITY:
        return HASANAT_ACTION_RULES.CHARITY_ACTION_COMPLETED.key;
      default:
        return `${sourceType}_LOG_CONTRIBUTION`;
    }
  }
}
