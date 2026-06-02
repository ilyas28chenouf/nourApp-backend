export class UpdateUserLearningProgressUsecase {
  constructor(
    private readonly persistence: import('../../domain/learning/ports/learning-persistence.port').LearningPersistencePort,
  ) {}
  async execute(userId: string, idOrData: any, data?: any) {
    if (typeof idOrData === 'string') {
      const existing = await this.persistence.findProgressById(idOrData);
      if (!existing || existing.userId !== userId)
        throw new Error('Record not found');
      return this.persistence.updateProgress(idOrData, data);
    }
    return this.persistence.createProgress({ ...idOrData, userId });
  }
}
