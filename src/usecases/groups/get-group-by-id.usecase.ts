export class GetGroupByIdUsecase {
  constructor(
    private readonly persistence: import('../../domain/groups/ports/groups-persistence.port').GroupsPersistencePort,
  ) {}
  execute(_userId: string, id: string) {
    return this.persistence.findById(id);
  }
}
