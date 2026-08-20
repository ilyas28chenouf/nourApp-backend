import { CharityActionType } from '../../domain/charity/enums/charity-action-type.enum';
import { GOAL_CATALOG } from '../../domain/goals/constants/goal-catalog';
import { GoalFrequency } from '../../domain/goals/enums/goal-frequency.enum';
import { GoalType } from '../../domain/goals/enums/goal-type.enum';
import { GoalModel } from '../../domain/goals/model/goal.model';
import { PrayerName } from '../../domain/prayers/enums/prayer-name.enum';
import { PrayerStatus } from '../../domain/prayers/enums/prayer-status.enum';
import { GoalCatalogUsecase } from './goal-catalog.usecase';
import { GoalAnalyticsUsecase } from './goal-analytics.usecase';
import { GoalEvaluationService } from './goal-evaluation.service';

describe('v1.6 goal catalog and automatic evaluation', () => {
  it('contains stable definitions and maps Donations to existing SADAQA', () => {
    expect(GOAL_CATALOG).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'PRAYER_FRIDAY_MOSQUE' }),
        expect.objectContaining({
          code: 'ACTIVITY_SADAQA',
          actionType: CharityActionType.SADAQA,
          title: 'Donations',
        }),
      ]),
    );
    expect(new Set(GOAL_CATALOG.map((item) => item.code)).size).toBe(
      GOAL_CATALOG.length,
    );
    expect(PrayerName).not.toHaveProperty('JUMUAH');
  });

  it('materializes catalog goals into the existing Goal shape', () => {
    expect(
      new GoalCatalogUsecase().materialize({
        goalCode: 'PRAYER_FRIDAY_MOSQUE',
        startDate: '2026-08-01',
      }),
    ).toMatchObject({
      goalCode: 'PRAYER_FRIDAY_MOSQUE',
      title: 'Prière du vendredi à la mosquée',
      goalType: GoalType.PRAYER,
      targetValue: 1,
      frequency: GoalFrequency.WEEKLY,
    });
  });

  it('uses Friday + Dhuhr + DONE + mosque evidence and loads each domain once', async () => {
    const prayers = {
      findByUserId: jest.fn().mockResolvedValue([
        {
          id: 'prayer-1',
          userId: 'user-1',
          prayerDate: '2026-08-21',
          prayerName: PrayerName.DHUHR,
          status: PrayerStatus.DONE,
          wasOnTime: true,
          isSupererogatory: false,
          prayedAtMosque: true,
        },
      ]),
      findAdditionalByUserId: jest.fn().mockResolvedValue([]),
    };
    const quran = {
      findLogsByUserId: jest.fn().mockResolvedValue([]),
      findMemorizationByUserId: jest.fn().mockResolvedValue([]),
    };
    const dhikr = { findLogsByUserId: jest.fn().mockResolvedValue([]) };
    const fasting = {
      findLogsByUserId: jest.fn().mockResolvedValue([]),
      findRecommendedDays: jest.fn().mockResolvedValue([]),
    };
    const charity = { findByUserId: jest.fn().mockResolvedValue([]) };
    const tafsir = { findProgressByUserId: jest.fn().mockResolvedValue([]) };
    const service = new GoalEvaluationService(
      prayers as never,
      quran as never,
      dhikr as never,
      fasting as never,
      charity as never,
      tafsir as never,
    );
    const goals: GoalModel[] = [
      goal('goal-friday', 'PRAYER_FRIDAY_MOSQUE'),
      goal('goal-five', 'PRAYER_FIVE_DAILY'),
    ];

    const result = await service.evaluateGoals(
      'user-1',
      goals,
      '2026-08-17',
      '2026-08-23',
    );

    expect(result[0]).toMatchObject({
      actual: 1,
      target: 1,
      percentage: 100,
      completed: true,
      applicable: true,
    });
    expect(result[1]).toMatchObject({ actual: 1, target: 35 });
    for (const dependency of [
      prayers.findByUserId,
      prayers.findAdditionalByUserId,
      quran.findLogsByUserId,
      quran.findMemorizationByUserId,
      dhikr.findLogsByUserId,
      fasting.findLogsByUserId,
      fasting.findRecommendedDays,
      charity.findByUserId,
      tafsir.findProgressByUserId,
    ]) {
      expect(dependency).toHaveBeenCalledTimes(1);
    }
  });

  it('does not let extra prayers on one day compensate for another day', () => {
    const service = evaluationService();
    const result = service.evaluate(
      goal('goal-on-time', 'PRAYER_TWO_ON_TIME_DAILY'),
      evidence({
        prayers: [
          prayer('p1', '2026-08-20', PrayerName.FAJR),
          prayer('p2', '2026-08-20', PrayerName.DHUHR),
          prayer('p3', '2026-08-20', PrayerName.ASR),
          prayer('p4', '2026-08-21', PrayerName.FAJR),
        ],
      }),
      '2026-08-20',
      '2026-08-21',
    );

    expect(result).toMatchObject({ actual: 3, target: 4, percentage: 75 });
  });

  it('scales monthly activity targets and creates every intersecting month week', async () => {
    const service = evaluationService();
    const activityGoal = goal('goal-activity', 'ACTIVITY_SADAQA');
    activityGoal.startDate = '2026-01-01';
    const result = service.evaluate(
      activityGoal,
      evidence({
        charity: [
          {
            id: 'charity-1',
            userId: 'user-1',
            charityDate: '2026-08-20',
            actionType: CharityActionType.SADAQA,
          },
        ],
      }),
      '2026-01-01',
      '2026-12-31',
    );
    expect(result).toMatchObject({ actual: 1, target: 12 });

    const analytics = new GoalAnalyticsUsecase({
      loadEvidence: jest.fn().mockResolvedValue({}),
      evaluate: jest.fn().mockReturnValue(null),
    } as never);
    const month = await analytics.execute('user-1', [activityGoal], {
      period: 'MONTH',
      anchor: '2026-08-20',
    });
    expect(month.buckets).toHaveLength(6);
    expect(month.buckets[0]).toMatchObject({
      from: '2026-08-01',
      to: '2026-08-02',
    });
    expect(month.buckets[5]).toMatchObject({
      from: '2026-08-31',
      to: '2026-08-31',
    });
  });
});

function evaluationService() {
  return new GoalEvaluationService(
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
  );
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

function prayer(id: string, prayerDate: string, prayerName: PrayerName) {
  return {
    id,
    userId: 'user-1',
    prayerDate,
    prayerName,
    status: PrayerStatus.DONE,
    wasOnTime: true,
    prayedAtMosque: false,
    isSupererogatory: false,
  };
}

function goal(id: string, goalCode: string): GoalModel {
  return {
    id,
    ownerUserId: 'user-1',
    goalCode,
    title: goalCode,
    goalType: GoalType.PRAYER,
    frequency: GoalFrequency.DAILY,
    startDate: '2026-08-01',
    isGroupGoal: false,
    isActive: true,
  };
}
