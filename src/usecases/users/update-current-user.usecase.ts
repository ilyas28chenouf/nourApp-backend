import { NotFoundException } from '@nestjs/common';
import { UserModel } from '../../domain/users/model/user.model';
import { UsersPersistencePort } from '../../domain/users/ports/users-persistence.port';
import { AppLoggerService } from '../../infrastructure/logger/app-logger.service';

type UpdateCurrentUserData = Pick<
  Partial<UserModel>,
  | 'firstName'
  | 'lastName'
  | 'phone'
  | 'avatarUrl'
  | 'language'
  | 'ageRange'
  | 'gender'
>;

export class UpdateCurrentUserUsecase {
  constructor(
    private readonly users: UsersPersistencePort,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(userId: string, data: UpdateCurrentUserData) {
    const existing = await this.users.findById(userId);
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    const updatePayload: UpdateCurrentUserData = {};
    if (data.firstName !== undefined) updatePayload.firstName = data.firstName;
    if (data.lastName !== undefined) updatePayload.lastName = data.lastName;
    if (data.phone !== undefined) updatePayload.phone = data.phone;
    if (data.avatarUrl !== undefined) updatePayload.avatarUrl = data.avatarUrl;
    if (data.language !== undefined) updatePayload.language = data.language;
    if (data.ageRange !== undefined) updatePayload.ageRange = data.ageRange;
    if (data.gender !== undefined) updatePayload.gender = data.gender;

    await this.users.update(userId, updatePayload);
    const updated = await this.users.findById(userId);
    if (!updated) {
      throw new NotFoundException('User not found');
    }
    this.logger.debug('User profile updated', {
      userId,
      updatedFields: Object.keys(updatePayload),
    });
    return updated;
  }
}
