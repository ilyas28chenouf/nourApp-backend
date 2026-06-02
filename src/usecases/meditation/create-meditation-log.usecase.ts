export class CreateMeditationLogUsecase {
  constructor(
    private readonly persistence: import('../../domain/meditation/ports/meditation-persistence.port').MeditationPersistencePort,
  ) {}
  execute(userId: string, data: any) {
    return this.persistence.create({ ...data, userId });
  }
}
