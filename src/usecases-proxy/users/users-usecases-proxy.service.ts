import { Injectable } from '@nestjs/common';
import { UsersTypeormAdapter } from '../../infrastructure/users/adapters/users-typeorm.adapter';
import { GetCurrentUserUsecase } from '../../usecases/users/get-current-user.usecase';
import { UpdateCurrentUserUsecase } from '../../usecases/users/update-current-user.usecase';
import { UpdateUserLocationUsecase } from '../../usecases/users/update-user-location.usecase';

@Injectable()
export class UsersUsecasesProxyService {
  constructor(private readonly users: UsersTypeormAdapter) {}

  getCurrentUser(user: any) {
    return new GetCurrentUserUsecase(this.users).execute(user);
  }
  updateCurrentUser(userId: string, data: any) {
    return new UpdateCurrentUserUsecase(this.users).execute(userId, data);
  }
  updateUserLocation(userId: string, data: any) {
    return new UpdateUserLocationUsecase(this.users).execute(userId, data);
  }
}
