import { AdditionalPrayerTime } from '../../domain/prayers/enums/additional-prayer-time.enum';
import { PrayerMode } from '../../domain/prayers/enums/prayer-mode.enum';
import { PrayerName } from '../../domain/prayers/enums/prayer-name.enum';
import { PrayerStatus } from '../../domain/prayers/enums/prayer-status.enum';
import { ReadingPeriod } from '../../domain/quran/enums/reading-period.enum';
import { QuranMemorizationStatus } from '../../domain/quran/enums/quran-memorization-status.enum';
import { DhikrPeriod } from '../../domain/dhikr/enums/dhikr-period.enum';
import { DhikrSessionType } from '../../domain/dhikr/enums/dhikr-session-type.enum';
import { FastingStatus } from '../../domain/fasting/enums/fasting-status.enum';
import { FastingType } from '../../domain/fasting/enums/fasting-type.enum';
import { GoalFrequency } from '../../domain/goals/enums/goal-frequency.enum';
import { GoalType } from '../../domain/goals/enums/goal-type.enum';
import { GoalModel } from '../../domain/goals/model/goal.model';
import { GoalEvaluationService } from './goal-evaluation.service';

const DATE = '2026-09-04';
const OBLIGATORY_PRAYERS = [
  PrayerName.FAJR,
  PrayerName.DHUHR,
  PrayerName.ASR,
  PrayerName.MAGHRIB,
  PrayerName.ISHA,
];

describe('GoalEvaluationService approved rules', () => {
  describe('prayer goals', () => {
    it('requires exactly the five obligatory prayers for the daily-five goal', () => {
      const five = OBLIGATORY_PRAYERS.map((name, index) =>
        prayer(`p-${index}`, name),
      );
      expect(evaluate('PRAYER_FIVE_DAILY', { prayers: five })).toMatchObject({
        actual: 5,
        target: 5,
        completed: true,
      });
      expect(
        evaluate('PRAYER_FIVE_DAILY', { prayers: five.slice(0, 4) }),
      ).toMatchObject({ actual: 4, target: 5, completed: false });
      expect(
        evaluate('PRAYER_FIVE_DAILY', {
          prayers: [prayer('jumuah', PrayerName.JUMUAH)],
        }),
      ).toMatchObject({ actual: 0, target: 5, completed: false });
    });

    it('evaluates two-on-time, all-on-time and Sobh from obligatory logs', () => {
      const prayers = OBLIGATORY_PRAYERS.map((name, index) =>
        prayer(`p-${index}`, name, {
          status: index === 4 ? PrayerStatus.LATE : PrayerStatus.DONE,
          wasOnTime: index !== 4,
        }),
      );
      expect(evaluate('PRAYER_FIVE_DAILY', { prayers })).toMatchObject({
        actual: 5,
        target: 5,
        completed: true,
      });
      expect(evaluate('PRAYER_TWO_ON_TIME_DAILY', { prayers })).toMatchObject({
        actual: 2,
        target: 2,
        completed: true,
      });
      expect(evaluate('PRAYER_ALL_ON_TIME_DAILY', { prayers })).toMatchObject({
        actual: 4,
        target: 5,
        completed: false,
      });
      expect(evaluate('PRAYER_FAJR_ON_TIME', { prayers })).toMatchObject({
        actual: 1,
        target: 1,
        completed: true,
      });
    });

    it('counts unique obligatory mosque and group prayers only', () => {
      const twoMosque = [
        prayer('fajr', PrayerName.FAJR, { prayedAtMosque: true }),
        prayer('dhuhr', PrayerName.DHUHR, { prayedAtMosque: true }),
        prayer('jumuah', PrayerName.JUMUAH, {
          prayedAtMosque: true,
          prayerMode: PrayerMode.GROUP_PHYSICAL,
        }),
      ];
      expect(
        evaluate('PRAYER_MOSQUE_ONE_DAILY', { prayers: twoMosque }),
      ).toMatchObject({ actual: 1, target: 1, completed: true });
      expect(
        evaluate('PRAYER_MOSQUE_TWO_DAILY', { prayers: twoMosque }),
      ).toMatchObject({ actual: 2, target: 2, completed: true });
      expect(
        evaluate('PRAYER_MOSQUE_THREE_DAILY', { prayers: twoMosque }),
      ).toMatchObject({ actual: 2, target: 3, completed: false });

      const threeMosque = [
        ...twoMosque,
        prayer('asr', PrayerName.ASR, { prayedAtMosque: true }),
      ];
      expect(
        evaluate('PRAYER_MOSQUE_THREE_DAILY', { prayers: threeMosque }),
      ).toMatchObject({ actual: 3, target: 3, completed: true });

      expect(
        evaluate('PRAYER_GROUP_DAILY', {
          prayers: [
            prayer('maghrib', PrayerName.MAGHRIB, {
              prayerMode: PrayerMode.GROUP_APP,
            }),
          ],
        }),
      ).toMatchObject({ completed: true });
    });

    it('requires an explicit Jumuah mosque log for the Friday goal', () => {
      const friday = '2026-08-21';
      expect(
        evaluate(
          'PRAYER_FRIDAY_MOSQUE',
          {
            prayers: [
              prayer('dhuhr', PrayerName.DHUHR, {
                prayerDate: friday,
                prayedAtMosque: true,
              }),
            ],
          },
          friday,
          friday,
        ),
      ).toMatchObject({ actual: 0, target: 1, completed: false });
      expect(
        evaluate(
          'PRAYER_FRIDAY_MOSQUE',
          {
            prayers: [
              prayer('jumuah', PrayerName.JUMUAH, {
                prayerDate: friday,
                prayedAtMosque: true,
              }),
            ],
          },
          friday,
          friday,
        ),
      ).toMatchObject({ actual: 1, target: 1, completed: true });
    });

    it.each([
      [AdditionalPrayerTime.DAY, 'DAY', 2, true, true, false],
      [AdditionalPrayerTime.DAY, 'DAY', 6, true, true, false],
      [AdditionalPrayerTime.DAY, 'DAY', 7, true, false, true],
      [AdditionalPrayerTime.NIGHT, 'NIGHT', 2, true, true, false],
      [AdditionalPrayerTime.NIGHT, 'NIGHT', 6, true, true, false],
      [AdditionalPrayerTime.NIGHT, 'NIGHT', 7, true, false, true],
    ])(
      'applies the %s rakaat boundaries at %i units',
      (prayerTime, codePart, rakaat, minimum, range, greater) => {
        const evidence = {
          additionalPrayers: [
            { id: 'additional', prayerDate: DATE, prayerTime, rakaat },
          ],
        };
        expect(
          evaluate(`PRAYER_ADDITIONAL_${codePart}_MIN_2`, evidence),
        ).toMatchObject({ completed: minimum });
        expect(
          evaluate(`PRAYER_ADDITIONAL_${codePart}_2_6`, evidence),
        ).toMatchObject({ completed: range });
        expect(
          evaluate(`PRAYER_ADDITIONAL_${codePart}_GT_6`, evidence),
        ).toMatchObject({ completed: greater });
      },
    );
  });

  describe('Quran goals', () => {
    it('requires positive reading quantities and both periods for the compound goal', () => {
      const emptyMorning = quran('empty', ReadingPeriod.MORNING, 0);
      expect(
        evaluate('QURAN_MORNING', { quran: [emptyMorning] }),
      ).toMatchObject({ completed: false });

      const morning = quran('morning', ReadingPeriod.MORNING, 1);
      expect(evaluate('QURAN_MORNING', { quran: [morning] })).toMatchObject({
        completed: true,
      });
      expect(
        evaluate('QURAN_MORNING_EVENING', { quran: [morning] }),
      ).toMatchObject({ completed: false });
      expect(
        evaluate('QURAN_MORNING_EVENING', {
          quran: [morning, quran('evening', ReadingPeriod.EVENING, 2)],
        }),
      ).toMatchObject({ completed: true });
    });

    it('requires reading and dated memorization evidence on the same day', () => {
      const reading = quran('reading', ReadingPeriod.DAY, 1);
      expect(
        evaluate('QURAN_DAILY_MEMORIZATION', { quran: [reading] }),
      ).toMatchObject({ completed: false });
      expect(
        evaluate('QURAN_DAILY_MEMORIZATION', {
          quran: [reading],
          memorization: [memorization(DATE)],
        }),
      ).toMatchObject({ completed: true });
    });

    it('uses canonical Surah numbers and real Tafsir progress', () => {
      expect(
        evaluate('QURAN_RECOMMENDED_SURAHS', {
          quran: [
            {
              ...quran('kahf', ReadingPeriod.DAY, 1),
              surahNumber: 18,
            },
          ],
        }),
      ).toMatchObject({ completed: true });
      expect(
        evaluate('QURAN_MEMORIZATION_TAFSIR', {
          memorization: [memorization(DATE)],
          tafsir: [{ readDate: DATE, completed: true }],
        }),
      ).toMatchObject({ completed: true });
    });
  });

  describe('Dhikr goals', () => {
    it('keeps morning/evening invocations as an AND condition', () => {
      const morning = dhikr(
        'morning',
        DhikrPeriod.MORNING,
        DhikrSessionType.MORNING_ADHKAR,
        1,
        true,
      );
      expect(evaluate('DHIKR_MORNING', { dhikr: [morning] })).toMatchObject({
        completed: true,
      });
      expect(
        evaluate('DHIKR_MORNING_EVENING', { dhikr: [morning] }),
      ).toMatchObject({ completed: false });
      expect(
        evaluate('DHIKR_MORNING_EVENING', {
          dhikr: [
            morning,
            dhikr(
              'evening',
              DhikrPeriod.EVENING,
              DhikrSessionType.EVENING_ADHKAR,
              1,
              true,
            ),
          ],
        }),
      ).toMatchObject({ completed: true });
    });

    it('requires each triple component to reach 100 independently', () => {
      expect(
        evaluate('DHIKR_MORNING_TRIPLE_100', {
          dhikr: tripleDhikr(DhikrPeriod.MORNING, [100, 100, 100]),
        }),
      ).toMatchObject({ completed: true });
      expect(
        evaluate('DHIKR_MORNING_TRIPLE_100', {
          dhikr: tripleDhikr(DhikrPeriod.MORNING, [300, 0, 0]),
        }),
      ).toMatchObject({ completed: false });
    });

    it('requires invocations and triple components for both complete routines', () => {
      const invocations = [
        dhikr(
          'morning-adhkar',
          DhikrPeriod.MORNING,
          DhikrSessionType.MORNING_ADHKAR,
          1,
          true,
        ),
        dhikr(
          'evening-adhkar',
          DhikrPeriod.EVENING,
          DhikrSessionType.EVENING_ADHKAR,
          1,
          true,
        ),
      ];
      expect(
        evaluate('DHIKR_MORNING_EVENING_COMPLETE', {
          dhikr: invocations,
        }),
      ).toMatchObject({ completed: false });
      expect(
        evaluate('DHIKR_MORNING_EVENING_COMPLETE', {
          dhikr: [
            ...invocations,
            ...tripleDhikr(DhikrPeriod.MORNING, [100, 100, 100]),
            ...tripleDhikr(DhikrPeriod.EVENING, [100, 100, 100]),
          ],
        }),
      ).toMatchObject({ completed: true });
    });
  });

  describe('fasting goals', () => {
    it('requires the actual Monday and Thursday dates in the evaluated week', () => {
      const monday = fasting('monday', '2026-08-17', FastingType.MONDAY);
      const thursday = fasting('thursday', '2026-08-20', FastingType.THURSDAY);
      const range = ['2026-08-17', '2026-08-23'] as const;
      expect(
        evaluate('FASTING_MONDAY', { fasting: [monday] }, ...range),
      ).toMatchObject({ actual: 1, target: 1, completed: true });
      expect(
        evaluate('FASTING_THURSDAY', { fasting: [thursday] }, ...range),
      ).toMatchObject({ actual: 1, target: 1, completed: true });
      expect(
        evaluate(
          'FASTING_MONDAY_THURSDAY',
          { fasting: [monday, thursday] },
          ...range,
        ),
      ).toMatchObject({ actual: 2, target: 2, completed: true });
      expect(
        evaluate(
          'FASTING_MONDAY_THURSDAY',
          {
            fasting: [
              fasting('tuesday', '2026-08-18', FastingType.OTHER),
              fasting('wednesday', '2026-08-19', FastingType.CUSTOM),
            ],
          },
          ...range,
        ),
      ).toMatchObject({ actual: 0, target: 2, completed: false });
    });

    it('requires three classified white days and excludes arbitrary custom fasts from Sunnah', () => {
      const whiteDays = ['2026-09-11', '2026-09-12', '2026-09-13'].map(
        (date, index) =>
          fasting(`white-${index}`, date, FastingType.WHITE_DAYS),
      );
      expect(
        evaluate(
          'FASTING_WHITE_DAYS',
          { fasting: whiteDays },
          '2026-09-01',
          '2026-09-30',
        ),
      ).toMatchObject({ actual: 3, target: 3, completed: true });
      expect(
        evaluate(
          'FASTING_SUNNAH',
          {
            fasting: [fasting('custom', DATE, FastingType.CUSTOM)],
          },
          '2026-09-01',
          '2026-09-30',
        ),
      ).toMatchObject({ actual: 0, target: 1, completed: false });
      expect(
        evaluate(
          'FASTING_SUNNAH',
          { fasting: [fasting('arafah', DATE, FastingType.ARAFAH)] },
          '2026-09-01',
          '2026-09-30',
        ),
      ).toMatchObject({ actual: 1, target: 1, completed: true });
    });

    it('anchors the Daoud cadence on startDate and ignores alternating rest days', () => {
      const startDate = '2026-09-04';
      expect(
        evaluate(
          'FASTING_DAOUD',
          { fasting: [fasting('day-0', startDate, FastingType.OTHER)] },
          startDate,
          startDate,
          startDate,
        ),
      ).toMatchObject({ actual: 1, target: 1, completed: true });
      expect(
        evaluate('FASTING_DAOUD', {}, '2026-09-05', '2026-09-05', startDate),
      ).toMatchObject({ actual: 0, target: 0, applicable: false });
      expect(
        evaluate(
          'FASTING_DAOUD',
          {
            fasting: [fasting('day-2', '2026-09-06', FastingType.OTHER)],
          },
          '2026-09-06',
          '2026-09-06',
          startDate,
        ),
      ).toMatchObject({ actual: 1, target: 1, completed: true });
    });
  });
});

function evaluate(
  goalCode: string,
  overrides: Record<string, unknown> = {},
  from = DATE,
  to = DATE,
  startDate = '2026-01-01',
) {
  return service().evaluate(
    goal(goalCode, startDate),
    evidence(overrides),
    from,
    to,
  );
}

function service() {
  return new GoalEvaluationService(
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
  );
}

function goal(goalCode: string, startDate: string): GoalModel {
  return {
    id: `goal-${goalCode}`,
    ownerUserId: 'user-1',
    goalCode,
    title: goalCode,
    goalType: GoalType.CUSTOM,
    frequency: GoalFrequency.DAILY,
    startDate,
    isGroupGoal: false,
    isActive: true,
  };
}

function evidence(overrides: Record<string, unknown> = {}) {
  return {
    prayers: [],
    additionalPrayers: [],
    quran: [],
    memorization: [],
    dhikr: [],
    fasting: [],
    recommendedFastingDays: [],
    charity: [],
    tafsir: [],
    ...overrides,
  };
}

function prayer(
  id: string,
  prayerName: PrayerName,
  overrides: Record<string, unknown> = {},
) {
  return {
    id,
    userId: 'user-1',
    prayerDate: DATE,
    prayerName,
    status: PrayerStatus.DONE,
    wasOnTime: true,
    prayerMode: PrayerMode.INDIVIDUAL,
    isSupererogatory: false,
    prayedAtMosque: false,
    ...overrides,
  };
}

function quran(id: string, readingPeriod: ReadingPeriod, pagesCount: number) {
  return {
    id,
    userId: 'user-1',
    readingDate: DATE,
    pagesCount,
    hizbCount: 0,
    readingPeriod,
    objectiveReached: false,
  };
}

function memorization(date: string) {
  return {
    id: 'memorization',
    userId: 'user-1',
    surahNumber: 1,
    status: QuranMemorizationStatus.IN_PROGRESS,
    lastReviewedAt: new Date(`${date}T12:00:00.000Z`),
  };
}

function dhikr(
  id: string,
  period: DhikrPeriod,
  sessionType: DhikrSessionType,
  counter: number,
  completed = false,
) {
  return {
    id,
    userId: 'user-1',
    dhikrDate: DATE,
    period,
    sessionType,
    counter,
    completed,
  };
}

function tripleDhikr(period: DhikrPeriod, counters: [number, number, number]) {
  return [
    dhikr('tasbih', period, DhikrSessionType.TASBIH, counters[0]),
    dhikr('salawat', period, DhikrSessionType.SALAWAT, counters[1]),
    dhikr('istighfar', period, DhikrSessionType.ISTIGHFAR, counters[2]),
  ];
}

function fasting(id: string, fastingDate: string, fastingType: FastingType) {
  return {
    id,
    userId: 'user-1',
    fastingDate,
    fastingType,
    status: FastingStatus.FASTED,
  };
}
