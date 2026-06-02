export class GetMyGroupsUsecase {
  constructor(
    private readonly persistence: import('../../domain/groups/ports/groups-persistence.port').GroupsPersistencePort,
  ) {}
  async execute(userId: string) {
    const memberships = await this.persistence.findMemberships(userId);
    return Promise.all(
      memberships
        .filter((m) => m.status === 'ACTIVE')
        .map((m) => this.persistence.findById(m.groupId)),
    );
  }
}
