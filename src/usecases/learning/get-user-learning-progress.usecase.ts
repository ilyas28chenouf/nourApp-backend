export class GetUserLearningProgressUsecase {
  constructor(
    private readonly persistence: import('../../domain/learning/ports/learning-persistence.port').LearningPersistencePort,
  ) {}
  execute(userId: string) {
    return this.persistence.findProgressByUserId(userId);
  }
}
