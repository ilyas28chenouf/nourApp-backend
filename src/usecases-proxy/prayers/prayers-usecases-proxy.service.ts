import { Injectable } from '@nestjs/common';
import { UmmahPrayersClient } from '../../infrastructure/external-apis/ummah/ummah-prayers.client';
import { PrayerLogsTypeormAdapter } from '../../infrastructure/prayers/adapters/prayer-logs-typeorm.adapter';
import { PrayerTimesTypeormAdapter } from '../../infrastructure/prayers/adapters/prayer-times-typeorm.adapter';
import { UserPreferencesTypeormAdapter } from '../../infrastructure/users/adapters/user-preferences-typeorm.adapter';
import { UsersTypeormAdapter } from '../../infrastructure/users/adapters/users-typeorm.adapter';
import { CreatePrayerLogUsecase } from '../../usecases/prayers/create-prayer-log.usecase';
import { GetPrayerLogsUsecase } from '../../usecases/prayers/get-prayer-logs.usecase';
import { GetPrayerMethodsUsecase } from '../../usecases/prayers/get-prayer-methods.usecase';
import { GetPrayerSummaryUsecase } from '../../usecases/prayers/get-prayer-summary.usecase';
import { GetPrayerTimesUsecase } from '../../usecases/prayers/get-prayer-times.usecase';
import { UpdatePrayerLogUsecase } from '../../usecases/prayers/update-prayer-log.usecase';

@Injectable()
export class PrayersUsecasesProxyService {
  constructor(
    private readonly times: PrayerTimesTypeormAdapter,
    private readonly logs: PrayerLogsTypeormAdapter,
    private readonly users: UsersTypeormAdapter,
    private readonly preferences: UserPreferencesTypeormAdapter,
    private readonly provider: UmmahPrayersClient,
  ) {}

  getPrayerTimes(userId: string, date: string) {
    return new GetPrayerTimesUsecase(
      this.times,
      this.users,
      this.preferences,
      this.provider,
    ).execute(userId, date);
  }
  getPrayerMethods() {
    return new GetPrayerMethodsUsecase(this.provider).execute();
  }
  getPrayerLogs(userId: string, from?: string, to?: string) {
    return new GetPrayerLogsUsecase(this.logs).execute(userId, from, to);
  }
  createPrayerLog(userId: string, data: any) {
    return new CreatePrayerLogUsecase(this.logs).execute(userId, data);
  }
  updatePrayerLog(userId: string, id: string, data: any) {
    return new UpdatePrayerLogUsecase(this.logs).execute(userId, id, data);
  }
  getPrayerSummary(userId: string, period: string) {
    return new GetPrayerSummaryUsecase(this.logs).execute(userId, period);
  }
}
