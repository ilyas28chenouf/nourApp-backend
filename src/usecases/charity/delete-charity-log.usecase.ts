export class DeleteCharityLogUsecase {
  constructor(
    private readonly persistence: import('../../domain/charity/ports/charity-persistence.port').CharityPersistencePort,
  ) {}
  async execute(userId: string, id: string) {
    const existing = await this.persistence.findById(id);
    if (!existing || existing.userId !== userId)
      throw new Error('Record not found');
    await this.persistence.delete(id);
    return { deleted: true };
  }
}
