import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminResourcesController } from './interface-adapters/admin/controllers/admin-resources.controller';
import { AdminDhikrController } from './interface-adapters/admin/controllers/admin-dhikr.controller';
import { AdminHadithController } from './interface-adapters/admin/controllers/admin-hadith.controller';
import { AdminProgressionController } from './interface-adapters/admin/controllers/admin-progression.controller';
import { AdminUsersController } from './interface-adapters/admin/controllers/admin-users.controller';
import { AdminTafsirController } from './interface-adapters/admin/controllers/admin-tafsir.controller';
import { AuthController } from './interface-adapters/auth/controllers/auth.controller';
import { CharityController } from './interface-adapters/charity/controllers/charity.controller';
import { DashboardController } from './interface-adapters/dashboard/controllers/dashboard.controller';
import { DiaryController } from './interface-adapters/diary/controllers/diary.controller';
import { DhikrController } from './interface-adapters/dhikr/controllers/dhikr.controller';
import { FastingController } from './interface-adapters/fasting/controllers/fasting.controller';
import { GoalsController } from './interface-adapters/goals/controllers/goals.controller';
import { GroupsController } from './interface-adapters/groups/controllers/groups.controller';
import { HadithController } from './interface-adapters/hadith/controllers/hadith.controller';
import { LearningController } from './interface-adapters/learning/controllers/learning.controller';
import { MeditationController } from './interface-adapters/meditation/controllers/meditation.controller';
import { NotificationsController } from './interface-adapters/notifications/controllers/notifications.controller';
import { PreferencesController } from './interface-adapters/preferences/controllers/preferences.controller';
import { PrayersController } from './interface-adapters/prayers/controllers/prayers.controller';
import { ProgressionController } from './interface-adapters/progression/controllers/progression.controller';
import { QuranController } from './interface-adapters/quran/controllers/quran.controller';
import { ResourcesController } from './interface-adapters/resources/controllers/resources.controller';
import { TafsirController } from './interface-adapters/tafsir/controllers/tafsir.controller';
import { UsersController } from './interface-adapters/users/controllers/users.controller';
import { WomenController } from './interface-adapters/women/controllers/women.controller';
import { DatabaseModule } from './infrastructure/database/database.module';
import { FirebaseModule } from './infrastructure/firebase/firebase.module';
import { HttpExceptionLoggingFilter } from './infrastructure/logger/http-exception-logging.filter';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { LoggingInterceptor } from './infrastructure/logger/logging.interceptor';
import { RequestIdMiddleware } from './infrastructure/logger/request-id.middleware';
import { AdminUsecasesProxyModule } from './usecases-proxy/admin/admin-usecases-proxy.module';
import { AuthUsecasesProxyModule } from './usecases-proxy/auth/auth-usecases-proxy.module';
import { CharityUsecasesProxyModule } from './usecases-proxy/charity/charity-usecases-proxy.module';
import { DashboardUsecasesProxyModule } from './usecases-proxy/dashboard/dashboard-usecases-proxy.module';
import { DiaryUsecasesProxyModule } from './usecases-proxy/diary/diary-usecases-proxy.module';
import { DhikrUsecasesProxyModule } from './usecases-proxy/dhikr/dhikr-usecases-proxy.module';
import { FastingUsecasesProxyModule } from './usecases-proxy/fasting/fasting-usecases-proxy.module';
import { GoalsUsecasesProxyModule } from './usecases-proxy/goals/goals-usecases-proxy.module';
import { GroupsUsecasesProxyModule } from './usecases-proxy/groups/groups-usecases-proxy.module';
import { HadithUsecasesProxyModule } from './usecases-proxy/hadith/hadith-usecases-proxy.module';
import { LearningUsecasesProxyModule } from './usecases-proxy/learning/learning-usecases-proxy.module';
import { MeditationUsecasesProxyModule } from './usecases-proxy/meditation/meditation-usecases-proxy.module';
import { NotificationsUsecasesProxyModule } from './usecases-proxy/notifications/notifications-usecases-proxy.module';
import { PreferencesUsecasesProxyModule } from './usecases-proxy/preferences/preferences-usecases-proxy.module';
import { PrayersUsecasesProxyModule } from './usecases-proxy/prayers/prayers-usecases-proxy.module';
import { ProgressionUsecasesProxyModule } from './usecases-proxy/progression/progression-usecases-proxy.module';
import { QuranUsecasesProxyModule } from './usecases-proxy/quran/quran-usecases-proxy.module';
import { ResourcesUsecasesProxyModule } from './usecases-proxy/resources/resources-usecases-proxy.module';
import { TafsirUsecasesProxyModule } from './usecases-proxy/tafsir/tafsir-usecases-proxy.module';
import { UsersUsecasesProxyModule } from './usecases-proxy/users/users-usecases-proxy.module';
import { WomenUsecasesProxyModule } from './usecases-proxy/women/women-usecases-proxy.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    FirebaseModule,
    LoggerModule,
    AuthUsecasesProxyModule,
    UsersUsecasesProxyModule,
    PreferencesUsecasesProxyModule,
    PrayersUsecasesProxyModule,
    ProgressionUsecasesProxyModule,
    FastingUsecasesProxyModule,
    QuranUsecasesProxyModule,
    HadithUsecasesProxyModule,
    TafsirUsecasesProxyModule,
    DhikrUsecasesProxyModule,
    CharityUsecasesProxyModule,
    MeditationUsecasesProxyModule,
    ResourcesUsecasesProxyModule,
    LearningUsecasesProxyModule,
    NotificationsUsecasesProxyModule,
    GoalsUsecasesProxyModule,
    GroupsUsecasesProxyModule,
    DashboardUsecasesProxyModule,
    WomenUsecasesProxyModule,
    DiaryUsecasesProxyModule,
    AdminUsecasesProxyModule,
  ],
  controllers: [
    AuthController,
    UsersController,
    PreferencesController,
    PrayersController,
    FastingController,
    QuranController,
    HadithController,
    TafsirController,
    DhikrController,
    CharityController,
    MeditationController,
    ResourcesController,
    LearningController,
    NotificationsController,
    GoalsController,
    GroupsController,
    DashboardController,
    WomenController,
    DiaryController,
    AdminUsersController,
    AdminResourcesController,
    AdminDhikrController,
    AdminHadithController,
    AdminTafsirController,
    AdminProgressionController,
    ProgressionController,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionLoggingFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
