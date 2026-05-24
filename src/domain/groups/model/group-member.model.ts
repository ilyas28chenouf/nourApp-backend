import { GroupMemberRole } from '../enums/group-member-role.enum'; import { GroupMemberStatus } from '../enums/group-member-status.enum';
export interface GroupMemberModel { id: string; groupId: string; userId: string; role: GroupMemberRole; status: GroupMemberStatus; joinedAt?: Date | null; createdAt?: Date; updatedAt?: Date; }
