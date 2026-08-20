import { Module } from '@nestjs/common';
import { GoalsTypeormAdapter } from '../../infrastructure/goals/adapters/goals-typeorm.adapter';
import { GroupsTypeormAdapter } from '../../infrastructure/groups/adapters/groups-typeorm.adapter';
import { PrayerLogsTypeormAdapter } from '../../infrastructure/prayers/adapters/prayer-logs-typeorm.adapter';
import { QuranTypeormAdapter } from '../../infrastructure/quran/adapters/quran-typeorm.adapter';
import { DhikrTypeormAdapter } from '../../infrastructure/dhikr/adapters/dhikr-typeorm.adapter';
import { FastingTypeormAdapter } from '../../infrastructure/fasting/adapters/fasting-typeorm.adapter';
import { CharityTypeormAdapter } from '../../infrastructure/charity/adapters/charity-typeorm.adapter';
import { TafsirTypeormAdapter } from '../../infrastructure/tafsir/adapters/tafsir-typeorm.adapter';
import { GoalsUsecasesProxyService } from './goals-usecases-proxy.service';

@Module({
  providers: [
    GoalsTypeormAdapter,
    GroupsTypeormAdapter,
    PrayerLogsTypeormAdapter,
    QuranTypeormAdapter,
    DhikrTypeormAdapter,
    FastingTypeormAdapter,
    CharityTypeormAdapter,
    TafsirTypeormAdapter,
    GoalsUsecasesProxyService,
  ],
  exports: [GoalsUsecasesProxyService],
})
export class GoalsUsecasesProxyModule {}
