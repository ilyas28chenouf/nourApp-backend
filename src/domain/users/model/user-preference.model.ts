import type { PrayerMadhabValue } from '../enums/prayer-madhab.enum';

export interface UserPreferenceModel {
  id: string;
  userId: string;
  theme: string;
  language: string;
  prayerNotificationsEnabled: boolean;
  fastingNotificationsEnabled: boolean;
  dhikrNotificationsEnabled: boolean;
  quranNotificationsEnabled: boolean;
  activityNotificationsEnabled: boolean;
  encouragementNotificationsEnabled: boolean;
  dailyReminderEnabled: boolean;
  dailyReminderTime: string;
  dailyReminderCycleStartDate?: string | null;
  prayerCalculationMethod: string;
  prayerMadhab: PrayerMadhabValue;
  dailyAvailableTime?: string | null;
  globalPracticeLevel?: string | null;
  prayerPracticeLevel?: string[] | null;
  quranPracticeLevel?: string[] | null;
  dhikrPractices?: string[] | null;
  fastingPracticeLevel?: string[] | null;
  socialActionsFrequency?: string | null;
  regularityDuration?: string | null;
  islamicKnowledgeLevel?: string | null;
  mainIntention?: string | null;
  mainIntentions?: string[] | null;
  createdAt?: Date;
  updatedAt?: Date;
}
