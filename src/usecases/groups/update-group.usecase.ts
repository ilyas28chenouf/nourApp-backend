export class UpdateGroupUsecase {
  constructor(
    private readonly persistence: import('../../domain/groups/ports/groups-persistence.port').GroupsPersistencePort,
  ) {}
  execute(_userId: string, id: string, data: any) {
    return this.persistence.update(id, data);
  }
}
