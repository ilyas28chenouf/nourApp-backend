export class JoinGroupUsecase {
  constructor(
    private readonly persistence: import('../../domain/groups/ports/groups-persistence.port').GroupsPersistencePort,
  ) {}
  async execute(userId: string, inviteCode: string) {
    const group = await this.persistence.findByInviteCode(inviteCode);
    if (!group) throw new Error('Group not found');
    const existing = await this.persistence.findMember(group.id, userId);
    return existing
      ? this.persistence.updateMember(existing.id, {
          status: 'ACTIVE',
          joinedAt: new Date(),
        })
      : this.persistence.createMember({
          groupId: group.id,
          userId,
          role: 'MEMBER',
          status: 'ACTIVE',
          joinedAt: new Date(),
        });
  }
}
