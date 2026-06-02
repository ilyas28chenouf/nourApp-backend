export class UpdateResourceUsecase {
  constructor(
    private readonly persistence: import('../../domain/resources/ports/resources-persistence.port').ResourcesPersistencePort,
  ) {}
  execute(id: string, data: any) {
    return this.persistence.update(id, data);
  }
}
