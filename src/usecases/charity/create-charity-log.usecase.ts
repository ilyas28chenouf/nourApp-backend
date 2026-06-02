export class CreateCharityLogUsecase {
  constructor(
    private readonly persistence: import('../../domain/charity/ports/charity-persistence.port').CharityPersistencePort,
  ) {}
  execute(userId: string, data: any) {
    return this.persistence.create({ ...data, userId });
  }
}
