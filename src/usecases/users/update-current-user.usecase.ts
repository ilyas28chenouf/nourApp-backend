import { NotFoundException } from '@nestjs/common';
import { UserModel } from '../../domain/users/model/user.model';
import { UsersPersistencePort } from '../../domain/users/ports/users-persistence.port';

type UpdateCurrentUserData = Pick<
  Partial<UserModel>,
  'fullName' | 'phone' | 'avatarUrl' | 'language'
>;

export class UpdateCurrentUserUsecase {
  constructor(private readonly users: UsersPersistencePort) {}

  async execute(userId: string, data: UpdateCurrentUserData) {
    const existing = await this.users.findById(userId);
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    const updatePayload: UpdateCurrentUserData = {};
    if (data.fullName !== undefined) updatePayload.fullName = data.fullName;
    if (data.phone !== undefined) updatePayload.phone = data.phone;
    if (data.avatarUrl !== undefined) updatePayload.avatarUrl = data.avatarUrl;
    if (data.language !== undefined) updatePayload.language = data.language;

    await this.users.update(userId, updatePayload);
    const updated = await this.users.findById(userId);
    if (!updated) {
      throw new NotFoundException('User not found');
    }
    return updated;
  }
}
