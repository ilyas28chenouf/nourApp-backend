import { NotFoundException } from '@nestjs/common';
import type { UserModel } from '../../domain/users/model/user.model';
import { UsersPersistencePort } from '../../domain/users/ports/users-persistence.port';

export class GetCurrentUserUsecase {
  constructor(private readonly users: UsersPersistencePort) {}

  async execute(user: UserModel): Promise<UserModel> {
    const current = await this.users.findById(user.id);
    if (!current) {
      throw new NotFoundException('User not found');
    }
    return current;
  }
}
