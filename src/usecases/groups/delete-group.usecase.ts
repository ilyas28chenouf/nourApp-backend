export class DeleteGroupUsecase {
  constructor(
    private readonly persistence: import('../../domain/groups/ports/groups-persistence.port').GroupsPersistencePort,
  ) {}
  async execute(_userId: string, id: string) {
    await this.persistence.update(id, { isActive: false });
    return { deleted: true };
  }
}
