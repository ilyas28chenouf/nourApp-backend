export class GetLearningItemByIdUsecase {
  constructor(
    private readonly persistence: import('../../domain/learning/ports/learning-persistence.port').LearningPersistencePort,
  ) {}
  execute(id: string) {
    return this.persistence.findItemById(id);
  }
}
