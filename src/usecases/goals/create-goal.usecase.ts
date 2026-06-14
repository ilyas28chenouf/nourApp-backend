export class CreateGoalUsecase {
  constructor(
    private readonly persistence: import('../../domain/goals/ports/goals-persistence.port').GoalsPersistencePort,
  ) {}
  execute(userId: string, data: any) {
    return this.persistence.create({
      ...data,
      ownerUserId: userId,
      groupId: null,
      isGroupGoal: false,
      isActive: true,
    });
  }
}
