import { UsersPersistencePort } from '../../domain/users/ports/users-persistence.port';
export class UpdateCurrentUserUsecase { constructor(private readonly users: UsersPersistencePort) {} execute(userId: string, data: any) { return this.users.update(userId, data); } }
