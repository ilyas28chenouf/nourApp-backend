import { GoalCatalogUsecase } from './goal-catalog.usecase';

export class CreateGoalUsecase {
  constructor(
    private readonly persistence: import('../../domain/goals/ports/goals-persistence.port').GoalsPersistencePort,
  ) {}
  execute(userId: string, data: any, defaultStartDate?: string) {
    const materialized = new GoalCatalogUsecase().materialize(
      data,
      defaultStartDate,
    );
    return this.persistence.create({
      ...materialized,
      ownerUserId: userId,
      groupId: null,
      isGroupGoal: false,
      isActive: true,
    });
  }
}
