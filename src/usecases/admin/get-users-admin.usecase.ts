export class GetUsersAdminUsecase { constructor(private readonly users: import('../../domain/users/ports/users-persistence.port').UsersPersistencePort) {} execute() { return this.users.findAll(); } }
