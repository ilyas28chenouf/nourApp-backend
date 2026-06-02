export class UpdateGoalUsecase {
  constructor(
    private readonly persistence: import('../../domain/goals/ports/goals-persistence.port').GoalsPersistencePort,
  ) {}
  async execute(userId: string, id: string, data: any) {
    const goal = await this.persistence.findById(id);
    if (!goal || goal.ownerUserId !== userId) throw new Error('Goal not found');
    return this.persistence.update(id, data);
  }
}
