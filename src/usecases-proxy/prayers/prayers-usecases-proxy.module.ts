import { Module } from '@nestjs/common';
import { UmmahPrayerMethodsClient } from '../../infrastructure/external-apis/ummah/ummah-prayer-methods.client';
import { UmmahPrayerTimesClient } from '../../infrastructure/external-apis/ummah/ummah-prayer-times.client';
import { UmmahPrayersClient } from '../../infrastructure/external-apis/ummah/ummah-prayers.client';
import { PrayerLogsTypeormAdapter } from '../../infrastructure/prayers/adapters/prayer-logs-typeorm.adapter';
import { PrayerTimesTypeormAdapter } from '../../infrastructure/prayers/adapters/prayer-times-typeorm.adapter';
import { UserPreferencesTypeormAdapter } from '../../infrastructure/users/adapters/user-preferences-typeorm.adapter';
import { UsersTypeormAdapter } from '../../infrastructure/users/adapters/users-typeorm.adapter';
import { PrayersUsecasesProxyService } from './prayers-usecases-proxy.service';

@Module({
  providers: [
    PrayerTimesTypeormAdapter,
    PrayerLogsTypeormAdapter,
    UsersTypeormAdapter,
    UserPreferencesTypeormAdapter,
    UmmahPrayerTimesClient,
    UmmahPrayerMethodsClient,
    UmmahPrayersClient,
    PrayersUsecasesProxyService,
  ],
  exports: [PrayersUsecasesProxyService],
})
export class PrayersUsecasesProxyModule {}
