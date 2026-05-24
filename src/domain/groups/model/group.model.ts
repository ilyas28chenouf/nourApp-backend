export interface GroupModel { id: string; name: string; description?: string | null; ownerUserId: string; inviteCode: string; isActive: boolean; createdAt?: Date; updatedAt?: Date; }
