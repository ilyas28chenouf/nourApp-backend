import { UsersPersistencePort } from '../../domain/users/ports/users-persistence.port';
export class UpdateUserLocationUsecase {
  constructor(private readonly users: UsersPersistencePort) {}
  execute(userId: string, data: any) {
    return this.users.update(userId, data);
  }
}
