import { Injectable } from '@nestjs/common';
import { AppLoggerService } from '../../infrastructure/logger/app-logger.service';
import { UsersTypeormAdapter } from '../../infrastructure/users/adapters/users-typeorm.adapter';
import { GetCurrentUserUsecase } from '../../usecases/users/get-current-user.usecase';
import { UpdateCurrentUserUsecase } from '../../usecases/users/update-current-user.usecase';
import { UpdateUserLocationUsecase } from '../../usecases/users/update-user-location.usecase';
import { NotificationsSchedulerService } from '../../infrastructure/notifications/services/notifications-scheduler.service';

@Injectable()
export class UsersUsecasesProxyService {
  constructor(
    private readonly users: UsersTypeormAdapter,
    private readonly logger: AppLoggerService,
    private readonly scheduler: NotificationsSchedulerService,
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
  async updateUserLocation(userId: string, data: any) {
    const updated = await new UpdateUserLocationUsecase(
      this.users,
      this.logger,
    ).execute(userId, data);
    await this.scheduler.rescheduleUser(userId);
    return updated;
  }
}
