import type { UserModel } from '../../domain/users/model/user.model';
export class GetCurrentAuthUserUsecase {
  execute(user: UserModel): UserModel {
    return user;
  }
}
