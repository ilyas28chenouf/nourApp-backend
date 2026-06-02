export class GetPrayerSummaryUsecase {
  constructor(
    private readonly prayerLogs: import('../../domain/prayers/ports/prayer-logs-persistence.port').PrayerLogsPersistencePort,
  ) {}
  async execute(userId: string, period: string) {
    const logs = await this.prayerLogs.findByUserId(userId);
    return {
      period,
      total: logs.length,
      done: logs.filter((l) => l.status === 'DONE').length,
      missed: logs.filter((l) => l.status === 'MISSED').length,
      late: logs.filter((l) => l.status === 'LATE').length,
    };
  }
}
