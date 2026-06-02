export class GetGoalsUsecase {
  constructor(
    private readonly persistence: import('../../domain/goals/ports/goals-persistence.port').GoalsPersistencePort,
  ) {}
  execute(userId: string) {
    return this.persistence.findByOwnerUserId(userId);
  }
}
