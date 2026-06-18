export interface UserPreferenceModel {
  id: string;
  userId: string;
  theme: string;
  language: string;
  prayerNotificationsEnabled: boolean;
  fastingNotificationsEnabled: boolean;
  dhikrNotificationsEnabled: boolean;
  quranNotificationsEnabled: boolean;
  encouragementNotificationsEnabled: boolean;
  dailyReminderEnabled: boolean;
  dailyReminderTime: string;
  dailyReminderCycleStartDate?: string | null;
  prayerCalculationMethod: string;
  prayerMadhab: string;
  dailyAvailableTime?: string | null;
  globalPracticeLevel?: string | null;
  prayerPracticeLevel?: string | null;
  quranPracticeLevel?: string | null;
  dhikrPractices?: string[] | null;
  fastingPracticeLevel?: string | null;
  socialActionsFrequency?: string | null;
  regularityDuration?: string | null;
  islamicKnowledgeLevel?: string | null;
  mainIntention?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
