import { Injectable } from '@nestjs/common';
import { AppLoggerService } from '../../infrastructure/logger/app-logger.service';
import { UsersTypeormAdapter } from '../../infrastructure/users/adapters/users-typeorm.adapter';
import { GetCurrentUserUsecase } from '../../usecases/users/get-current-user.usecase';
import { UpdateCurrentUserUsecase } from '../../usecases/users/update-current-user.usecase';
import { UpdateUserLocationUsecase } from '../../usecases/users/update-user-location.usecase';

@Injectable()
export class UsersUsecasesProxyService {
  constructor(
    private readonly users: UsersTypeormAdapter,
    private readonly logger: AppLoggerService,
  ) {}

  getCurrentUser(user: any) {
    return new GetCurrentUserUsecase(this.users).execute(user);
  }
  updateCurrentUser(userId: string, data: any) {
    return new UpdateCurrentUserUsecase(this.users, this.logger).execute(
      userId,
      data,
    );
  }
  updateUserLocation(userId: string, data: any) {
    return new UpdateUserLocationUsecase(this.users, this.logger).execute(
      userId,
      data,
    );
  }
}
