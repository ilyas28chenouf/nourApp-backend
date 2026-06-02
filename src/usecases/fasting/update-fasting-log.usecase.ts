export class UpdateFastingLogUsecase {
  constructor(
    private readonly persistence: import('../../domain/fasting/ports/fasting-persistence.port').FastingPersistencePort,
  ) {}
  async execute(userId: string, id: string, data: any) {
    const existing = await this.persistence.findLogById(id);
    if (!existing || existing.userId !== userId)
      throw new Error('Record not found');
    return this.persistence.updateLog(id, data);
  }
}
