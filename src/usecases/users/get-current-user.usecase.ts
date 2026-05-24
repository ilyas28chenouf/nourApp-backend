import type { UserModel } from '../../domain/users/model/user.model';
export class GetCurrentUserUsecase { execute(user: UserModel): UserModel { return user; } }
