export class GetResourceByIdUsecase {
  constructor(
    private readonly persistence: import('../../domain/resources/ports/resources-persistence.port').ResourcesPersistencePort,
  ) {}
  execute(id: string) {
    return this.persistence.findById(id);
  }
}
