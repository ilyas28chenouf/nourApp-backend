export class UpdateQuranReadingGoalUsecase {
  constructor(
    private readonly persistence: import('../../domain/quran/ports/quran-persistence.port').QuranPersistencePort,
  ) {}
  async execute(userId: string, id: string, data: any) {
    const existing = await this.persistence.findGoalById(id);
    if (!existing || existing.userId !== userId)
      throw new Error('Record not found');
    return this.persistence.updateGoal(id, data);
  }
}
