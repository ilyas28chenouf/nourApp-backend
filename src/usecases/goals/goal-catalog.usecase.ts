import { BadRequestException } from '@nestjs/common';
import {
  findGoalCatalogDefinition,
  GOAL_CATALOG,
} from '../../domain/goals/constants/goal-catalog';
import { GoalCategory } from '../../domain/goals/enums/goal-category.enum';
import { GoalType } from '../../domain/goals/enums/goal-type.enum';
import { GoalModel } from '../../domain/goals/model/goal.model';

export class GoalCatalogUsecase {
  list(category?: GoalCategory) {
    return category
      ? GOAL_CATALOG.filter((definition) => definition.category === category)
      : [...GOAL_CATALOG];
  }

  materialize(
    data: Record<string, any>,
    defaultStartDate = new Date().toISOString().slice(0, 10),
  ) {
    if (!data.goalCode) return data;
    const definition = findGoalCatalogDefinition(String(data.goalCode));
    if (!definition) throw new BadRequestException('Unknown goalCode');

    return {
      ...data,
      goalCode: definition.code,
      title: definition.title,
      description: definition.description ?? null,
      goalType: this.toGoalType(definition.category),
      targetValue: definition.target,
      targetUnit: definition.targetUnit,
      frequency: definition.frequency,
      startDate: data.startDate ?? defaultStartDate,
    };
  }

  withCatalogDefinition<T extends GoalModel>(goal: T): T {
    if (!goal.goalCode) return goal;
    const definition = findGoalCatalogDefinition(goal.goalCode);
    if (!definition) return goal;

    return {
      ...goal,
      title: definition.title,
      description: null,
      goalType: this.toGoalType(definition.category),
      targetValue: definition.target,
      targetUnit: definition.targetUnit,
      frequency: definition.frequency,
    };
  }

  private toGoalType(category: GoalCategory) {
    return category === GoalCategory.ACTIVITY
      ? GoalType.CHARITY
      : (category as unknown as GoalType);
  }
}
