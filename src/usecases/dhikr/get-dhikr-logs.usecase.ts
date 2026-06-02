export class GetDhikrLogsUsecase {
  constructor(
    private readonly persistence: import('../../domain/dhikr/ports/dhikr-persistence.port').DhikrPersistencePort,
  ) {}
  async execute(userId: string, date?: string) {
    const logs = await this.persistence.findLogsByUserId(userId);
    return date ? logs.filter((l) => l.dhikrDate === date) : logs;
  }
}
