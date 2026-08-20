import { DateTime } from 'luxon';
import {
  eachDateOnlyBetween,
  isDateOnlyInRange,
} from '../../common-utils/dates/date-format.util';
import {
  findGoalCatalogDefinition,
  RECOMMENDED_SURAH_NUMBERS,
} from '../../domain/goals/constants/goal-catalog';
import { GoalModel } from '../../domain/goals/model/goal.model';
import { PrayerLogsPersistencePort } from '../../domain/prayers/ports/prayer-logs-persistence.port';
import { QuranPersistencePort } from '../../domain/quran/ports/quran-persistence.port';
import { DhikrPersistencePort } from '../../domain/dhikr/ports/dhikr-persistence.port';
import { FastingPersistencePort } from '../../domain/fasting/ports/fasting-persistence.port';
import { CharityPersistencePort } from '../../domain/charity/ports/charity-persistence.port';
import { TafsirPersistencePort } from '../../domain/tafsir/ports/tafsir-persistence.port';
import { PrayerName } from '../../domain/prayers/enums/prayer-name.enum';
import { PrayerStatus } from '../../domain/prayers/enums/prayer-status.enum';
import { PrayerMode } from '../../domain/prayers/enums/prayer-mode.enum';
import { AdditionalPrayerTime } from '../../domain/prayers/enums/additional-prayer-time.enum';
import { ReadingPeriod } from '../../domain/quran/enums/reading-period.enum';
import { QuranMemorizationStatus } from '../../domain/quran/enums/quran-memorization-status.enum';
import { DhikrPeriod } from '../../domain/dhikr/enums/dhikr-period.enum';
import { DhikrSessionType } from '../../domain/dhikr/enums/dhikr-session-type.enum';
import { FastingStatus } from '../../domain/fasting/enums/fasting-status.enum';
import { FastingType } from '../../domain/fasting/enums/fasting-type.enum';

export interface GoalEvaluationResult {
  goalId: string;
  goalCode: string;
  from: string;
  to: string;
  actual: number;
  target: number;
  percentage: number;
  completed: boolean;
  applicable: boolean;
}

interface GoalEvidence {
  prayers: Awaited<ReturnType<PrayerLogsPersistencePort['findByUserId']>>;
  additionalPrayers: Awaited<
    ReturnType<PrayerLogsPersistencePort['findAdditionalByUserId']>
  >;
  quran: Awaited<ReturnType<QuranPersistencePort['findLogsByUserId']>>;
  memorization: Awaited<
    ReturnType<QuranPersistencePort['findMemorizationByUserId']>
  >;
  dhikr: Awaited<ReturnType<DhikrPersistencePort['findLogsByUserId']>>;
  fasting: Awaited<ReturnType<FastingPersistencePort['findLogsByUserId']>>;
  recommendedFastingDays: Awaited<
    ReturnType<FastingPersistencePort['findRecommendedDays']>
  >;
  charity: Awaited<ReturnType<CharityPersistencePort['findByUserId']>>;
  tafsir: Awaited<ReturnType<TafsirPersistencePort['findProgressByUserId']>>;
}

export class GoalEvaluationService {
  constructor(
    private readonly prayers: PrayerLogsPersistencePort,
    private readonly quran: QuranPersistencePort,
    private readonly dhikr: DhikrPersistencePort,
    private readonly fasting: FastingPersistencePort,
    private readonly charity: CharityPersistencePort,
    private readonly tafsir: TafsirPersistencePort,
  ) {}

  async evaluateGoals(
    userId: string,
    goals: GoalModel[],
    from: string,
    to: string,
  ) {
    const evidence = await this.loadEvidence(userId);
    return goals.map((goal) => this.evaluate(goal, evidence, from, to));
  }

  async loadEvidence(userId: string): Promise<GoalEvidence> {
    const [
      prayers,
      additionalPrayers,
      quran,
      memorization,
      dhikr,
      fasting,
      recommendedFastingDays,
      charity,
      tafsir,
    ] = await Promise.all([
      this.prayers.findByUserId(userId),
      this.prayers.findAdditionalByUserId(userId),
      this.quran.findLogsByUserId(userId),
      this.quran.findMemorizationByUserId(userId),
      this.dhikr.findLogsByUserId(userId),
      this.fasting.findLogsByUserId(userId),
      this.fasting.findRecommendedDays(),
      this.charity.findByUserId(userId),
      this.tafsir.findProgressByUserId(userId),
    ]);
    return {
      prayers,
      additionalPrayers,
      quran,
      memorization,
      dhikr,
      fasting,
      recommendedFastingDays,
      charity,
      tafsir,
    };
  }

  evaluate(
    goal: GoalModel,
    evidence: GoalEvidence,
    from: string,
    to: string,
  ): GoalEvaluationResult | null {
    if (!goal.goalCode) return null;
    const definition = findGoalCatalogDefinition(goal.goalCode);
    if (!definition) return null;
    const effectiveFrom = goal.startDate > from ? goal.startDate : from;
    const effectiveTo = goal.endDate && goal.endDate < to ? goal.endDate : to;
    if (effectiveFrom > effectiveTo) {
      return this.result(goal, from, to, 0, 0);
    }

    const days = eachDateOnlyBetween(effectiveFrom, effectiveTo);
    const daySet = new Set(days);
    const inDays = (date: string) => daySet.has(date);
    const prayers = evidence.prayers.filter((item) => inDays(item.prayerDate));
    const quran = evidence.quran.filter((item) => inDays(item.readingDate));
    const dhikr = evidence.dhikr.filter((item) => inDays(item.dhikrDate));
    const fasting = evidence.fasting.filter((item) => inDays(item.fastingDate));

    switch (definition.code) {
      case 'PRAYER_FIVE_DAILY':
        return this.result(
          goal,
          effectiveFrom,
          effectiveTo,
          this.standardPrayerCount(prayers),
          days.length * 5,
        );
      case 'PRAYER_TWO_ON_TIME_DAILY':
        return this.result(
          goal,
          effectiveFrom,
          effectiveTo,
          days.reduce(
            (total, date) =>
              total +
              Math.min(
                this.standardPrayerCount(
                  prayers.filter(
                    (item) => item.prayerDate === date && item.wasOnTime,
                  ),
                ),
                2,
              ),
            0,
          ),
          days.length * 2,
        );
      case 'PRAYER_ALL_ON_TIME_DAILY':
        return this.booleanDays(
          goal,
          effectiveFrom,
          effectiveTo,
          days,
          (date) =>
            this.standardPrayerCount(
              prayers.filter(
                (item) => item.prayerDate === date && item.wasOnTime,
              ),
            ) >= 5,
        );
      case 'PRAYER_FAJR_ON_TIME':
        return this.booleanDays(
          goal,
          effectiveFrom,
          effectiveTo,
          days,
          (date) =>
            prayers.some(
              (item) =>
                item.prayerDate === date &&
                item.prayerName === PrayerName.FAJR &&
                item.status === PrayerStatus.DONE &&
                item.wasOnTime,
            ),
        );
      case 'PRAYER_GROUP_DAILY':
        return this.cappedPrayerDays(
          goal,
          effectiveFrom,
          effectiveTo,
          days,
          prayers,
          (item) =>
            item.status === PrayerStatus.DONE &&
            [PrayerMode.GROUP_PHYSICAL, PrayerMode.GROUP_APP].includes(
              item.prayerMode as PrayerMode,
            ),
          1,
        );
      case 'PRAYER_MOSQUE_ONE_DAILY':
      case 'PRAYER_MOSQUE_TWO_DAILY':
      case 'PRAYER_MOSQUE_THREE_DAILY':
        return this.cappedPrayerDays(
          goal,
          effectiveFrom,
          effectiveTo,
          days,
          prayers,
          (item) => item.status === PrayerStatus.DONE && item.prayedAtMosque,
          definition.target,
        );
      case 'PRAYER_FRIDAY_MOSQUE': {
        const fridays = days.filter((date) => this.weekday(date) === 5);
        const actual = fridays.filter((date) =>
          prayers.some(
            (item) =>
              item.prayerDate === date &&
              item.prayerName === PrayerName.DHUHR &&
              item.status === PrayerStatus.DONE &&
              item.prayedAtMosque,
          ),
        ).length;
        return this.result(
          goal,
          effectiveFrom,
          effectiveTo,
          actual,
          fridays.length,
        );
      }
      case 'PRAYER_ADDITIONAL_DAY_MIN_2':
      case 'PRAYER_ADDITIONAL_DAY_2_6':
      case 'PRAYER_ADDITIONAL_DAY_GT_6':
      case 'PRAYER_ADDITIONAL_NIGHT_MIN_2':
      case 'PRAYER_ADDITIONAL_NIGHT_2_6':
      case 'PRAYER_ADDITIONAL_NIGHT_GT_6': {
        const night = definition.code.includes('_NIGHT_');
        const actualDays = days.filter((date) => {
          const rakaat = evidence.additionalPrayers
            .filter(
              (item) =>
                item.prayerDate === date &&
                item.prayerTime ===
                  (night
                    ? AdditionalPrayerTime.NIGHT
                    : AdditionalPrayerTime.DAY),
            )
            .reduce((sum, item) => sum + item.rakaat, 0);
          if (definition.code.endsWith('_GT_6')) return rakaat > 6;
          if (definition.code.endsWith('_2_6'))
            return rakaat >= 2 && rakaat <= 6;
          return rakaat >= 2;
        }).length;
        return this.result(
          goal,
          effectiveFrom,
          effectiveTo,
          actualDays,
          days.length,
        );
      }
      case 'QURAN_MORNING':
        return this.booleanDays(
          goal,
          effectiveFrom,
          effectiveTo,
          days,
          (date) =>
            quran.some(
              (item) =>
                item.readingDate === date &&
                item.readingPeriod === ReadingPeriod.MORNING,
            ),
        );
      case 'QURAN_EVENING':
        return this.booleanDays(
          goal,
          effectiveFrom,
          effectiveTo,
          days,
          (date) =>
            quran.some(
              (item) =>
                item.readingDate === date &&
                item.readingPeriod === ReadingPeriod.EVENING,
            ),
        );
      case 'QURAN_MORNING_EVENING':
        return this.booleanDays(
          goal,
          effectiveFrom,
          effectiveTo,
          days,
          (date) =>
            [ReadingPeriod.MORNING, ReadingPeriod.EVENING].every((period) =>
              quran.some(
                (item) =>
                  item.readingDate === date && item.readingPeriod === period,
              ),
            ),
        );
      case 'QURAN_DAILY_MEMORIZATION': {
        const memorizationDates = this.memorizationDates(evidence);
        return this.booleanDays(
          goal,
          effectiveFrom,
          effectiveTo,
          days,
          (date) =>
            quran.some((item) => item.readingDate === date) &&
            memorizationDates.has(date),
        );
      }
      case 'QURAN_RECOMMENDED_SURAHS':
        return this.booleanDays(
          goal,
          effectiveFrom,
          effectiveTo,
          days,
          (date) =>
            quran.some(
              (item) =>
                item.readingDate === date &&
                item.surahNumber !== null &&
                item.surahNumber !== undefined &&
                RECOMMENDED_SURAH_NUMBERS.includes(item.surahNumber),
            ),
        );
      case 'QURAN_MEMORIZATION_TAFSIR': {
        const memorizationDates = this.memorizationDates(evidence);
        return this.booleanDays(
          goal,
          effectiveFrom,
          effectiveTo,
          days,
          (date) =>
            memorizationDates.has(date) &&
            evidence.tafsir.some(
              (item) => item.readDate === date && item.completed,
            ),
        );
      }
      case 'DHIKR_MORNING':
        return this.dhikrAdhkarDays(
          goal,
          dhikr,
          days,
          effectiveFrom,
          effectiveTo,
          DhikrSessionType.MORNING_ADHKAR,
        );
      case 'DHIKR_EVENING':
        return this.dhikrAdhkarDays(
          goal,
          dhikr,
          days,
          effectiveFrom,
          effectiveTo,
          DhikrSessionType.EVENING_ADHKAR,
        );
      case 'DHIKR_MORNING_EVENING':
        return this.booleanDays(
          goal,
          effectiveFrom,
          effectiveTo,
          days,
          (date) =>
            [
              DhikrSessionType.MORNING_ADHKAR,
              DhikrSessionType.EVENING_ADHKAR,
            ].every((sessionType) =>
              dhikr.some(
                (item) =>
                  item.dhikrDate === date &&
                  item.sessionType === sessionType &&
                  item.completed,
              ),
            ),
        );
      case 'DHIKR_MORNING_TRIPLE_100':
        return this.dhikrTripleDays(
          goal,
          dhikr,
          days,
          effectiveFrom,
          effectiveTo,
          DhikrPeriod.MORNING,
        );
      case 'DHIKR_EVENING_TRIPLE_100':
        return this.dhikrTripleDays(
          goal,
          dhikr,
          days,
          effectiveFrom,
          effectiveTo,
          DhikrPeriod.EVENING,
        );
      case 'DHIKR_MORNING_EVENING_COMPLETE':
        return this.booleanDays(
          goal,
          effectiveFrom,
          effectiveTo,
          days,
          (date) =>
            [DhikrPeriod.MORNING, DhikrPeriod.EVENING].every(
              (period) =>
                this.hasAdhkar(dhikr, date, period) &&
                this.hasTripleDhikr(dhikr, date, period),
            ),
        );
      case 'FASTING_MONDAY':
        return this.fastingRecommended(
          goal,
          evidence,
          fasting,
          effectiveFrom,
          effectiveTo,
          [FastingType.MONDAY],
        );
      case 'FASTING_THURSDAY':
        return this.fastingRecommended(
          goal,
          evidence,
          fasting,
          effectiveFrom,
          effectiveTo,
          [FastingType.THURSDAY],
        );
      case 'FASTING_MONDAY_THURSDAY':
        return this.fastingRecommended(
          goal,
          evidence,
          fasting,
          effectiveFrom,
          effectiveTo,
          [FastingType.MONDAY, FastingType.THURSDAY],
        );
      case 'FASTING_WHITE_DAYS':
        return this.fastingRecommended(
          goal,
          evidence,
          fasting,
          effectiveFrom,
          effectiveTo,
          [FastingType.WHITE_DAYS],
        );
      case 'FASTING_SUNNAH':
        return this.fastingRecommended(
          goal,
          evidence,
          fasting,
          effectiveFrom,
          effectiveTo,
          Object.values(FastingType).filter(
            (type) => type !== FastingType.RAMADAN,
          ),
        );
      case 'FASTING_DAOUD': {
        const cadenceDays = days.filter(
          (date) =>
            Math.abs(
              DateTime.fromISO(date).diff(
                DateTime.fromISO(goal.startDate),
                'days',
              ).days,
            ) %
              2 ===
            0,
        );
        const actual = cadenceDays.filter((date) =>
          fasting.some(
            (item) =>
              item.fastingDate === date && item.status === FastingStatus.FASTED,
          ),
        ).length;
        return this.result(
          goal,
          effectiveFrom,
          effectiveTo,
          actual,
          cadenceDays.length,
        );
      }
      default:
        if (definition.actionType) {
          const actual = evidence.charity.filter(
            (item) =>
              inDays(item.charityDate) &&
              item.actionType === definition.actionType,
          ).length;
          return this.result(
            goal,
            effectiveFrom,
            effectiveTo,
            actual,
            definition.target * this.monthsInRange(effectiveFrom, effectiveTo),
          );
        }
        return null;
    }
  }

  private standardPrayerCount(prayers: GoalEvidence['prayers']) {
    const standardNames = new Set([
      PrayerName.FAJR,
      PrayerName.DHUHR,
      PrayerName.ASR,
      PrayerName.MAGHRIB,
      PrayerName.ISHA,
    ]);
    return new Set(
      prayers
        .filter(
          (item) =>
            item.status === PrayerStatus.DONE &&
            standardNames.has(item.prayerName),
        )
        .map((item) => `${item.prayerDate}:${item.prayerName}`),
    ).size;
  }

  private cappedPrayerDays(
    goal: GoalModel,
    from: string,
    to: string,
    days: string[],
    prayers: GoalEvidence['prayers'],
    predicate: (prayer: GoalEvidence['prayers'][number]) => boolean,
    targetPerDay: number,
  ) {
    const actual = days.reduce(
      (total, date) =>
        total +
        Math.min(
          prayers.filter(
            (prayer) => prayer.prayerDate === date && predicate(prayer),
          ).length,
          targetPerDay,
        ),
      0,
    );
    return this.result(goal, from, to, actual, days.length * targetPerDay);
  }

  private monthsInRange(from: string, to: string) {
    const start = DateTime.fromISO(from, { zone: 'utc' }).startOf('month');
    const end = DateTime.fromISO(to, { zone: 'utc' }).startOf('month');
    return Math.floor(end.diff(start, 'months').months) + 1;
  }

  private booleanDays(
    goal: GoalModel,
    from: string,
    to: string,
    days: string[],
    predicate: (date: string) => boolean,
  ) {
    return this.result(
      goal,
      from,
      to,
      days.filter(predicate).length,
      days.length,
    );
  }

  private dhikrAdhkarDays(
    goal: GoalModel,
    dhikr: GoalEvidence['dhikr'],
    days: string[],
    from: string,
    to: string,
    sessionType: DhikrSessionType,
  ) {
    return this.booleanDays(goal, from, to, days, (date) =>
      dhikr.some(
        (item) =>
          item.dhikrDate === date &&
          item.sessionType === sessionType &&
          item.completed,
      ),
    );
  }

  private dhikrTripleDays(
    goal: GoalModel,
    dhikr: GoalEvidence['dhikr'],
    days: string[],
    from: string,
    to: string,
    period: DhikrPeriod,
  ) {
    return this.booleanDays(goal, from, to, days, (date) =>
      this.hasTripleDhikr(dhikr, date, period),
    );
  }

  private hasAdhkar(
    dhikr: GoalEvidence['dhikr'],
    date: string,
    period: DhikrPeriod,
  ) {
    const type =
      period === DhikrPeriod.MORNING
        ? DhikrSessionType.MORNING_ADHKAR
        : DhikrSessionType.EVENING_ADHKAR;
    return dhikr.some(
      (item) =>
        item.dhikrDate === date && item.sessionType === type && item.completed,
    );
  }

  private hasTripleDhikr(
    dhikr: GoalEvidence['dhikr'],
    date: string,
    period: DhikrPeriod,
  ) {
    return [
      DhikrSessionType.TASBIH,
      DhikrSessionType.SALAWAT,
      DhikrSessionType.ISTIGHFAR,
    ].every((sessionType) =>
      dhikr.some(
        (item) =>
          item.dhikrDate === date &&
          item.period === period &&
          item.sessionType === sessionType &&
          Number(item.counter) >= 100,
      ),
    );
  }

  private fastingRecommended(
    goal: GoalModel,
    evidence: GoalEvidence,
    fasting: GoalEvidence['fasting'],
    from: string,
    to: string,
    types: FastingType[],
  ) {
    const recommendations = evidence.recommendedFastingDays.filter(
      (day) =>
        isDateOnlyInRange(day.date, from, to) &&
        day.type !== FastingType.RAMADAN &&
        types.includes(day.type),
    );
    const dates = new Set(recommendations.map((day) => day.date));
    const actual = [...dates].filter((date) =>
      fasting.some(
        (item) =>
          item.fastingDate === date && item.status === FastingStatus.FASTED,
      ),
    ).length;
    return this.result(goal, from, to, actual, dates.size);
  }

  private memorizationDates(evidence: GoalEvidence) {
    return new Set(
      evidence.memorization
        .filter((item) => item.status !== QuranMemorizationStatus.NOT_STARTED)
        .map((item) => item.lastReviewedAt ?? item.updatedAt ?? item.createdAt)
        .filter((date): date is Date => date instanceof Date)
        .map((date) => date.toISOString().slice(0, 10)),
    );
  }

  private result(
    goal: GoalModel,
    from: string,
    to: string,
    actual: number,
    target: number,
  ): GoalEvaluationResult {
    const applicable = target > 0;
    const ratio = applicable ? Math.min(actual / target, 1) : 0;
    return {
      goalId: goal.id,
      goalCode: goal.goalCode!,
      from,
      to,
      actual,
      target,
      percentage: Number((ratio * 100).toFixed(2)),
      completed: applicable && actual >= target,
      applicable,
    };
  }

  private weekday(date: string) {
    return DateTime.fromISO(date, { zone: 'utc' }).weekday;
  }
}
