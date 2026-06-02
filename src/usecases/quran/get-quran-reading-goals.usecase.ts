export class GetQuranReadingGoalsUsecase {
  constructor(
    private readonly persistence: import('../../domain/quran/ports/quran-persistence.port').QuranPersistencePort,
  ) {}
  execute(userId: string) {
    return this.persistence.findGoalsByUserId(userId);
  }
}
