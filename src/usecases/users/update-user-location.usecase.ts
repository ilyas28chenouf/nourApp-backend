import { NotFoundException } from '@nestjs/common';
import { UserModel } from '../../domain/users/model/user.model';
import { UsersPersistencePort } from '../../domain/users/ports/users-persistence.port';

type UpdateUserLocationData = Pick<
  Partial<UserModel>,
  'timezone' | 'city' | 'country' | 'latitude' | 'longitude'
>;

export class UpdateUserLocationUsecase {
  constructor(private readonly users: UsersPersistencePort) {}

  async execute(userId: string, data: UpdateUserLocationData) {
    const existing = await this.users.findById(userId);
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    const updatePayload: UpdateUserLocationData = {};
    if (data.timezone !== undefined) updatePayload.timezone = data.timezone;
    if (data.city !== undefined) updatePayload.city = data.city;
    if (data.country !== undefined) updatePayload.country = data.country;
    if (data.latitude !== undefined) updatePayload.latitude = data.latitude;
    if (data.longitude !== undefined) updatePayload.longitude = data.longitude;

    await this.users.update(userId, updatePayload);
    const updated = await this.users.findById(userId);
    if (!updated) {
      throw new NotFoundException('User not found');
    }
    return updated;
  }
}
