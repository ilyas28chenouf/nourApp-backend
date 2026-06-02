export class CreateResourceUsecase {
  constructor(
    private readonly persistence: import('../../domain/resources/ports/resources-persistence.port').ResourcesPersistencePort,
  ) {}
  execute(createdBy: string, data: any) {
    return this.persistence.create({ ...data, createdBy });
  }
}
