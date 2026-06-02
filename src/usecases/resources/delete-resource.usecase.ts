export class DeleteResourceUsecase {
  constructor(
    private readonly persistence: import('../../domain/resources/ports/resources-persistence.port').ResourcesPersistencePort,
  ) {}
  async execute(id: string) {
    await this.persistence.update(id, { isActive: false });
    return { deleted: true };
  }
}
