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
  prayerCalculationMethod: string;
  prayerMadhab: string;
  createdAt?: Date;
  updatedAt?: Date;
}
