export class UpdatePrayerLogUsecase {
  constructor(
    private readonly prayerLogs: import('../../domain/prayers/ports/prayer-logs-persistence.port').PrayerLogsPersistencePort,
  ) {}
  async execute(userId: string, id: string, data: any) {
    const existing = await this.prayerLogs.findById(id);
    if (!existing || existing.userId !== userId)
      throw new Error('Record not found');
    return this.prayerLogs.update(id, data);
  }
}
