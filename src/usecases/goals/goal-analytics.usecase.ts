import { DateTime } from 'luxon';
import {
  CalendarPeriod,
  resolveCalendarRange,
} from '../../common-utils/dates/calendar-period.util';
import { eachDateOnlyBetween } from '../../common-utils/dates/date-format.util';
import {
  findGoalCatalogDefinition,
  GoalDisplayMode,
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
    const periodicGoals = selectedGoals.filter(
      (goal) =>
        findGoalCatalogDefinition(goal.goalCode!)?.displayMode ===
        GoalDisplayMode.PERIODIC,
    );
    const untimedGoals = selectedGoals.filter(
      (goal) =>
        findGoalCatalogDefinition(goal.goalCode!)?.displayMode ===
        GoalDisplayMode.UNTIMED,
    );
    const evidence = await this.evaluation.loadEvidence(userId);
    const evaluations = periodicGoals
      .map((goal) =>
        this.evaluateIndicator(
          goal,
          evidence,
          range.period,
          range.from,
          range.to,
        ),
      )
      .filter((item): item is GoalEvaluationResult => item !== null);
    const goalsResponse = evaluations.map((item) => {
      const definition = findGoalCatalogDefinition(item.goalCode)!;
      return {
        ...item,
        category: definition.category,
        title: definition.title,
        frequency: definition.frequency,
        targetUnit: definition.targetUnit,
        displayMode: definition.displayMode,
      };
    });

    const untimedGoalsResponse = untimedGoals
      .map((goal) =>
        this.evaluation.evaluateUntimed(
          goal,
          evidence,
          input.anchor ?? this.today(input.timezone),
        ),
      )
      .filter((item) => item !== null);

    const buckets = this.buckets(range.period, range.from, range.to).map(
      (bucket) => {
        const bucketGoals = periodicGoals
          .map((goal) =>
            bucket.indicatorPeriod
              ? this.evaluateIndicator(
                  goal,
                  evidence,
                  bucket.indicatorPeriod,
                  bucket.from,
                  bucket.to,
                )
              : this.evaluation.evaluate(
                  goal,
                  evidence,
                  bucket.from,
                  bucket.to,
                ),
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
      untimedGoals: untimedGoalsResponse,
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
      const definition = findGoalCatalogDefinition(goal.goalCode);
      if (definition?.displayMode === GoalDisplayMode.UNTIMED) {
        const result = this.evaluation.evaluateUntimed(
          goal,
          evidence,
          anchor.toISODate(),
        );
        if (!result) return null;
        const actual = result.milestones.reduce(
          (sum, milestone) => sum + milestone.actual,
          0,
        );
        const target = result.milestones.reduce(
          (sum, milestone) => sum + milestone.target,
          0,
        );
        return {
          goalId: result.goalId,
          goalCode: result.goalCode,
          from: anchor.toISODate(),
          to: anchor.toISODate(),
          actual,
          target,
          percentage: result.percentage,
          completed: result.completed,
          applicable: true,
        };
      }
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
        indicatorPeriod: null,
      }));
    }

    if (period === CalendarPeriod.MONTH) {
      return this.fixedWeekBlocks(from, 4).map((bucket, index) => ({
        key: `W${index + 1}`,
        label: `Week ${index + 1}`,
        ...bucket,
        indicatorPeriod: null,
      }));
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
        indicatorPeriod: CalendarPeriod.MONTH,
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

  private evaluateIndicator(
    goal: GoalModel,
    evidence: Awaited<ReturnType<GoalEvaluationService['loadEvidence']>>,
    period: CalendarPeriod,
    from: string,
    to: string,
  ): GoalEvaluationResult | null {
    if (!goal.goalCode) return null;
    const definition = findGoalCatalogDefinition(goal.goalCode);
    if (!definition || definition.displayMode !== GoalDisplayMode.PERIODIC) {
      return null;
    }
    const target = definition.indicatorTargets[period];
    if (target === null) return null;

    if (
      period === CalendarPeriod.WEEK &&
      definition.frequency === GoalFrequency.DAILY
    ) {
      const evaluation = this.evaluation.evaluate(goal, evidence, from, to);
      if (!evaluation) return null;
      return this.withIndicatorTarget(evaluation, target);
    }

    const blocks = this.fixedWeekBlocks(from, target);
    const actual = blocks.filter((block) => {
      const evaluation = this.evaluation.evaluate(
        goal,
        evidence,
        block.from,
        block.to,
      );
      return evaluation?.applicable && evaluation.completed;
    }).length;
    return {
      goalId: goal.id,
      goalCode: goal.goalCode,
      from,
      to,
      actual,
      target,
      percentage: Number(((actual / target) * 100).toFixed(2)),
      completed: actual >= target,
      applicable: true,
    };
  }

  private withIndicatorTarget(
    evaluation: GoalEvaluationResult,
    target: number,
  ): GoalEvaluationResult {
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

  private fixedWeekBlocks(from: string, count: number) {
    const start = DateTime.fromISO(from, { zone: 'utc' }).startOf('day');
    return Array.from({ length: count }, (_, index) => {
      const blockFrom = start.plus({ days: index * 7 });
      return {
        from: blockFrom.toISODate()!,
        to: blockFrom.plus({ days: 6 }).toISODate()!,
      };
    });
  }
}
