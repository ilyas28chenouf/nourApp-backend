export class UpdateMeditationLogUsecase {
  constructor(
    private readonly persistence: import('../../domain/meditation/ports/meditation-persistence.port').MeditationPersistencePort,
  ) {}
  async execute(userId: string, id: string, data: any) {
    const existing = await this.persistence.findById(id);
    if (!existing || existing.userId !== userId)
      throw new Error('Record not found');
    return this.persistence.update(id, data);
  }
}
