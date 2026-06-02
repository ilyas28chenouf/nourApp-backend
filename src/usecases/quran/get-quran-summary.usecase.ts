export class GetQuranSummaryUsecase {
  constructor(
    private readonly persistence: import('../../domain/quran/ports/quran-persistence.port').QuranPersistencePort,
  ) {}
  async execute(userId: string, period: string) {
    const logs = await this.persistence.findLogsByUserId(userId);
    return {
      period,
      pagesCount: logs.reduce((sum, l) => sum + Number(l.pagesCount ?? 0), 0),
      objectivesReached: logs.filter((l) => l.objectiveReached).length,
    };
  }
}
