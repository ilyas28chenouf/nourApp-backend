import { Injectable } from '@nestjs/common';
import { AppLoggerService } from '../../infrastructure/logger/app-logger.service';
import { UserPreferencesTypeormAdapter } from '../../infrastructure/users/adapters/user-preferences-typeorm.adapter';
import { GetUserPreferencesUsecase } from '../../usecases/preferences/get-user-preferences.usecase';
import { UpdateOnboardingPreferencesUsecase } from '../../usecases/preferences/update-onboarding-preferences.usecase';
import { UpdateUserPreferencesUsecase } from '../../usecases/preferences/update-user-preferences.usecase';
import { NotificationsSchedulerService } from '../../infrastructure/notifications/services/notifications-scheduler.service';

@Injectable()
export class PreferencesUsecasesProxyService {
  constructor(
    private readonly preferences: UserPreferencesTypeormAdapter,
    private readonly logger: AppLoggerService,
    private readonly scheduler: NotificationsSchedulerService,
  ) {}

  getUserPreferences(userId: string) {
    return new GetUserPreferencesUsecase(this.preferences).execute(userId);
  }
  async updateUserPreferences(userId: string, data: any) {
    const updated = await new UpdateUserPreferencesUsecase(
      this.preferences,
      this.logger,
    ).execute(userId, data);
    await this.scheduler.rescheduleUser(userId);
    return updated;
  }
  async updateOnboardingPreferences(userId: string, data: any) {
    const updated = await new UpdateOnboardingPreferencesUsecase(
      this.preferences,
      this.logger,
    ).execute(userId, data);
    await this.scheduler.rescheduleUser(userId);
    return updated;
  }
}
