import { Injectable } from '@nestjs/common';
import { AppLoggerService } from '../../infrastructure/logger/app-logger.service';
import { UserPreferencesTypeormAdapter } from '../../infrastructure/users/adapters/user-preferences-typeorm.adapter';
import { GetUserPreferencesUsecase } from '../../usecases/preferences/get-user-preferences.usecase';
import { UpdateOnboardingPreferencesUsecase } from '../../usecases/preferences/update-onboarding-preferences.usecase';
import { UpdateUserPreferencesUsecase } from '../../usecases/preferences/update-user-preferences.usecase';

@Injectable()
export class PreferencesUsecasesProxyService {
  constructor(
    private readonly preferences: UserPreferencesTypeormAdapter,
    private readonly logger: AppLoggerService,
  ) {}

  getUserPreferences(userId: string) {
    return new GetUserPreferencesUsecase(this.preferences).execute(userId);
  }
  updateUserPreferences(userId: string, data: any) {
    return new UpdateUserPreferencesUsecase(
      this.preferences,
      this.logger,
    ).execute(userId, data);
  }
  updateOnboardingPreferences(userId: string, data: any) {
    return new UpdateOnboardingPreferencesUsecase(
      this.preferences,
      this.logger,
    ).execute(userId, data);
  }
}
