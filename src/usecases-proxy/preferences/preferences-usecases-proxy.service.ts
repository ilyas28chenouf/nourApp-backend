import { Injectable } from '@nestjs/common';
import { UserPreferencesTypeormAdapter } from '../../infrastructure/users/adapters/user-preferences-typeorm.adapter';
import { GetUserPreferencesUsecase } from '../../usecases/preferences/get-user-preferences.usecase';
import { UpdateUserPreferencesUsecase } from '../../usecases/preferences/update-user-preferences.usecase';

@Injectable()
export class PreferencesUsecasesProxyService {
  

  constructor(private readonly preferences: UserPreferencesTypeormAdapter) {}

  getUserPreferences(userId: string) { return new GetUserPreferencesUsecase(this.preferences).execute(userId); }
  updateUserPreferences(userId: string, data: any) { return new UpdateUserPreferencesUsecase(this.preferences).execute(userId, data); }
}
