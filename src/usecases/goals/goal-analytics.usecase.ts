import { DateTime } from 'luxon';
import {
  CalendarPeriod,
  resolveCalendarRange,
} from '../../common-utils/dates/calendar-period.util';
import { eachDateOnlyBetween } from '../../common-utils/dates/date-format.util';
import {
  findGoalCatalogDefinition,
  GoalCatalogDefinition,
} from '../../domain/goals/constants/goal-catalog';
import { GoalCategory } from '../../domain/goals/enums/goal-category.enum';
import { GoalFrequency } from '../../domain/goals/enums/goal-frequency.enum';
import { GoalModel } from '../../domain/goals/model/goal.model';
import {
  GoalEvaluationResult,
  GoalEvaluationService,
} from './goal-evaluation.service';

export class GoalAnalyticsUsecase {
  constructor(private readonly evaluation: GoalEvaluationService) {}

  async execute(
    userId: string,
    goals: GoalModel[],
    input: {
      category?: GoalCategory;
      period?: string;
      anchor?: string;
      timezone?: string | null;
    },
  ) {
    const range = resolveCalendarRange(
      input.period,
      input.anchor ?? this.today(input.timezone),
    );
    const selectedGoals = goals.filter((goal) => {
      if (!goal.isActive || !goal.goalCode) return false;
      const definition = findGoalCatalogDefinition(goal.goalCode);
      return (
        definition &&
        (!input.category || definition.category === input.category)
      );
    });
    const evidence = await this.evaluation.loadEvidence(userId);
    const evaluations = selectedGoals
      .map((goal) =>
        this.evaluation.evaluate(goal, evidence, range.from, range.to),
      )
      .filter((item): item is GoalEvaluationResult => item !== null);
    const goalsResponse = evaluations.map((item) => {
      const definition = findGoalCatalogDefinition(item.goalCode)!;
      return {
        ...this.toIndicator(item, definition, range.period),
        category: definition.category,
        title: definition.title,
        frequency: definition.frequency,
        targetUnit: definition.targetUnit,
      };
    });

    const buckets = this.buckets(range.period, range.from, range.to).map(
      (bucket) => {
        const bucketGoals = selectedGoals
          .map((goal) =>
            this.evaluation.evaluate(goal, evidence, bucket.from, bucket.to),
          )
          .filter((item): item is GoalEvaluationResult => item !== null);
        return {
          ...bucket,
          goals: bucketGoals,
          summary: this.summary(bucketGoals),
        };
      },
    );

    return {
      ...range,
      selectedCategory: input.category ?? null,
      categorySummaries: this.categorySummaries(goalsResponse),
      goals: goalsResponse,
      buckets,
      summary: this.summary(goalsResponse),
    };
  }

  async evaluateCurrent(
    userId: string,
    goals: GoalModel[],
    timezone?: string | null,
  ) {
    const evidence = await this.evaluation.loadEvidence(userId);
    const anchor = this.now(timezone);
    return goals.map((goal) => {
      if (!goal.goalCode) return null;
      const range = this.currentGoalRange(goal.frequency, anchor);
      return this.evaluation.evaluate(goal, evidence, range.from, range.to);
    });
  }

  private currentGoalRange(frequency: GoalFrequency, anchor: DateTime) {
    const startUnit =
      frequency === GoalFrequency.DAILY
        ? 'day'
        : frequency === GoalFrequency.WEEKLY
          ? 'week'
          : frequency === GoalFrequency.MONTHLY
            ? 'month'
            : 'year';
    return {
      from: anchor.startOf(startUnit).toISODate()!,
      to: anchor.endOf(startUnit).toISODate()!,
    };
  }

  private today(timezone?: string | null) {
    return this.now(timezone).toISODate();
  }

  private now(timezone?: string | null) {
    const local = timezone ? DateTime.now().setZone(timezone) : DateTime.utc();
    return local.isValid ? local : DateTime.utc();
  }

  private buckets(period: CalendarPeriod, from: string, to: string) {
    if (period === CalendarPeriod.WEEK) {
      return eachDateOnlyBetween(from, to).map((date) => ({
        key: date,
        label: DateTime.fromISO(date).toFormat('ccc'),
        from: date,
        to: date,
      }));
    }

    if (period === CalendarPeriod.MONTH) {
      const buckets: Array<{
        key: string;
        label: string;
        from: string;
        to: string;
      }> = [];
      let cursor = DateTime.fromISO(from, { zone: 'utc' });
      const end = DateTime.fromISO(to, { zone: 'utc' });
      let index = 1;
      while (cursor <= end) {
        const bucketTo = DateTime.min(cursor.endOf('week'), end);
        buckets.push({
          key: `W${index}`,
          label: `Week ${index}`,
          from: cursor.toISODate()!,
          to: bucketTo.toISODate()!,
        });
        cursor = bucketTo.plus({ days: 1 }).startOf('day');
        index += 1;
      }
      return buckets;
    }

    return Array.from({ length: 12 }, (_, index) => {
      const month = DateTime.fromISO(from, { zone: 'utc' }).set({
        month: index + 1,
      });
      return {
        key: month.toFormat('yyyy-MM'),
        label: month.toFormat('LLLL'),
        from: month.startOf('month').toISODate()!,
        to: month.endOf('month').toISODate()!,
      };
    });
  }

  private categorySummaries(
    goals: Array<GoalEvaluationResult & { category: GoalCategory }>,
  ) {
    return Object.values(GoalCategory)
      .map((category) => {
        const matching = goals.filter((goal) => goal.category === category);
        return { category, ...this.summary(matching) };
      })
      .filter((item) => item.totalGoals > 0);
  }

  private summary(evaluations: GoalEvaluationResult[]) {
    const applicable = evaluations.filter((item) => item.applicable);
    return {
      totalGoals: evaluations.length,
      applicableGoals: applicable.length,
      completedGoals: applicable.filter((item) => item.completed).length,
      percentage:
        applicable.length === 0
          ? 0
          : Number(
              (
                applicable.reduce((sum, item) => sum + item.percentage, 0) /
                applicable.length
              ).toFixed(2),
            ),
    };
  }

  private toIndicator(
    evaluation: GoalEvaluationResult,
    definition: GoalCatalogDefinition,
    period: CalendarPeriod,
  ): GoalEvaluationResult {
    const target = definition.indicatorTargets[period];
    if (target === null) {
      return {
        ...evaluation,
        target: 0,
        percentage: 0,
        completed: false,
        applicable: false,
      };
    }

    const actual = Math.min(Math.max(0, evaluation.actual), target);
    return {
      ...evaluation,
      actual,
      target,
      percentage: Number(((actual / target) * 100).toFixed(2)),
      completed: actual >= target,
      applicable: true,
    };
  }
}
