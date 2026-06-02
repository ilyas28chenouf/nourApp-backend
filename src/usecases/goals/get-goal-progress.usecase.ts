export class GetGoalProgressUsecase {
  constructor(
    private readonly persistence: import('../../domain/goals/ports/goals-persistence.port').GoalsPersistencePort,
  ) {}
  execute(userId: string, goalId: string) {
    return this.persistence.findProgress(goalId, userId);
  }
}
