import { Module } from '@nestjs/common';
import { PrayerLogsTypeormAdapter } from '../../infrastructure/prayers/adapters/prayer-logs-typeorm.adapter';
import { PrayerTimesTypeormAdapter } from '../../infrastructure/prayers/adapters/prayer-times-typeorm.adapter';
import { PrayersUsecasesProxyService } from './prayers-usecases-proxy.service';

@Module({
  providers: [PrayerTimesTypeormAdapter, PrayerLogsTypeormAdapter, PrayersUsecasesProxyService],
  exports: [PrayersUsecasesProxyService],
})
export class PrayersUsecasesProxyModule {}
