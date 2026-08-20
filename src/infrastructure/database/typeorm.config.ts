import { UserTypeormEntity } from '../users/entities/user.typeorm-entity';
import { UserPreferenceTypeormEntity } from '../users/entities/user-preference.typeorm-entity';
import { PrayerTimeTypeormEntity } from '../prayers/entities/prayer-time.typeorm-entity';
import { PrayerLogTypeormEntity } from '../prayers/entities/prayer-log.typeorm-entity';
import { FastingRecommendedDayTypeormEntity } from '../fasting/entities/fasting-recommended-day.typeorm-entity';
import { FastingLogTypeormEntity } from '../fasting/entities/fasting-log.typeorm-entity';
import { QuranReadingLogTypeormEntity } from '../quran/entities/quran-reading-log.typeorm-entity';
import { QuranReadingGoalTypeormEntity } from '../quran/entities/quran-reading-goal.typeorm-entity';
import { DhikrItemTypeormEntity } from '../dhikr/entities/dhikr-item.typeorm-entity';
import { DhikrCategoryTypeormEntity } from '../dhikr/entities/dhikr-category.typeorm-entity';
import { DhikrLogTypeormEntity } from '../dhikr/entities/dhikr-log.typeorm-entity';
import { CharityLogTypeormEntity } from '../charity/entities/charity-log.typeorm-entity';
import { MeditationLogTypeormEntity } from '../meditation/entities/meditation-log.typeorm-entity';
import { ResourceTypeormEntity } from '../resources/entities/resource.typeorm-entity';
import { LearningItemTypeormEntity } from '../learning/entities/learning-item.typeorm-entity';
import { UserLearningProgressTypeormEntity } from '../learning/entities/user-learning-progress.typeorm-entity';
import { DeviceTokenTypeormEntity } from '../notifications/entities/device-token.typeorm-entity';
import { ScheduledNotificationTypeormEntity } from '../notifications/entities/scheduled-notification.typeorm-entity';
import { DailyReminderContentTypeormEntity } from '../notifications/entities/daily-reminder-content.typeorm-entity';
import { GoalTypeormEntity } from '../goals/entities/goal.typeorm-entity';
import { GoalProgressTypeormEntity } from '../goals/entities/goal-progress.typeorm-entity';
import { GroupTypeormEntity } from '../groups/entities/group.typeorm-entity';
import { GroupMemberTypeormEntity } from '../groups/entities/group-member.typeorm-entity';
import { GroupEncouragementTypeormEntity } from '../groups/entities/group-encouragement.typeorm-entity';
import { HasanatActionRuleTypeormEntity } from '../progression/entities/hasanat-action-rule.typeorm-entity';
import { HasanatPointEventTypeormEntity } from '../progression/entities/hasanat-point-event.typeorm-entity';
import { UserBadgeTypeormEntity } from '../progression/entities/user-badge.typeorm-entity';
import { UserProgressionTypeormEntity } from '../progression/entities/user-progression.typeorm-entity';
import { QuranMemorizationProgressTypeormEntity } from '../quran/entities/quran-memorization-progress.typeorm-entity';
import { SisterUnavailableDayTypeormEntity } from '../sisters/entities/sister-unavailable-day.typeorm-entity';
import { AdditionalPrayerLogTypeormEntity } from '../prayers/entities/additional-prayer-log.typeorm-entity';
import { WomenPeriodLogTypeormEntity } from '../women/entities/women-period-log.typeorm-entity';
import { WomenProgramActivityLogTypeormEntity } from '../women/entities/women-program-activity-log.typeorm-entity';
import { WomenProgramCycleTypeormEntity } from '../women/entities/women-program-cycle.typeorm-entity';
import { DiaryEntryTypeormEntity } from '../diary/entities/diary-entry.typeorm-entity';
import { HadithCollectionTypeormEntity } from '../hadith/entities/hadith-collection.typeorm-entity';
import { HadithItemTypeormEntity } from '../hadith/entities/hadith-item.typeorm-entity';
import { TafsirCollectionTypeormEntity } from '../tafsir/entities/tafsir-collection.typeorm-entity';
import { TafsirItemTypeormEntity } from '../tafsir/entities/tafsir-item.typeorm-entity';
import { TafsirProgressTypeormEntity } from '../tafsir/entities/tafsir-progress.typeorm-entity';
import { AsmaAlHusnaNameTypeormEntity } from '../asma-al-husna/entities/asma-al-husna-name.typeorm-entity';
import { AsmaAlHusnaTranslationTypeormEntity } from '../asma-al-husna/entities/asma-al-husna-translation.typeorm-entity';

export const TYPEORM_ENTITIES = [
  UserTypeormEntity,
  UserPreferenceTypeormEntity,
  PrayerTimeTypeormEntity,
  PrayerLogTypeormEntity,
  FastingRecommendedDayTypeormEntity,
  FastingLogTypeormEntity,
  QuranReadingLogTypeormEntity,
  QuranReadingGoalTypeormEntity,
  QuranMemorizationProgressTypeormEntity,
  DhikrCategoryTypeormEntity,
  DhikrItemTypeormEntity,
  DhikrLogTypeormEntity,
  CharityLogTypeormEntity,
  MeditationLogTypeormEntity,
  ResourceTypeormEntity,
  LearningItemTypeormEntity,
  UserLearningProgressTypeormEntity,
  DeviceTokenTypeormEntity,
  ScheduledNotificationTypeormEntity,
  DailyReminderContentTypeormEntity,
  GoalTypeormEntity,
  GoalProgressTypeormEntity,
  GroupTypeormEntity,
  GroupMemberTypeormEntity,
  GroupEncouragementTypeormEntity,
  UserProgressionTypeormEntity,
  HasanatPointEventTypeormEntity,
  HasanatActionRuleTypeormEntity,
  UserBadgeTypeormEntity,
  SisterUnavailableDayTypeormEntity,
  AdditionalPrayerLogTypeormEntity,
  WomenPeriodLogTypeormEntity,
  WomenProgramCycleTypeormEntity,
  WomenProgramActivityLogTypeormEntity,
  DiaryEntryTypeormEntity,
  HadithCollectionTypeormEntity,
  HadithItemTypeormEntity,
  TafsirCollectionTypeormEntity,
  TafsirItemTypeormEntity,
  TafsirProgressTypeormEntity,
  AsmaAlHusnaNameTypeormEntity,
  AsmaAlHusnaTranslationTypeormEntity,
];
