import { UserPreferenceModel } from '../../../domain/users/model/user-preference.model';

export class UserPreferenceResponseMapper {
  static toDto(model: UserPreferenceModel) {
    const mainIntentions =
      model.mainIntentions && model.mainIntentions.length > 0
        ? model.mainIntentions
        : model.mainIntention
          ? [model.mainIntention]
          : [];
    return {
      id: model.id,
      userId: model.userId,
      theme: model.theme,
      language: model.language,
      prayerNotificationsEnabled: model.prayerNotificationsEnabled,
      fastingNotificationsEnabled: model.fastingNotificationsEnabled,
      dhikrNotificationsEnabled: model.dhikrNotificationsEnabled,
      quranNotificationsEnabled: model.quranNotificationsEnabled,
      activityNotificationsEnabled: model.activityNotificationsEnabled,
      encouragementNotificationsEnabled:
        model.encouragementNotificationsEnabled,
      dailyReminderEnabled: model.dailyReminderEnabled,
      dailyReminderTime: model.dailyReminderTime,
      dailyReminderCycleStartDate: model.dailyReminderCycleStartDate,
      prayerCalculationMethod: model.prayerCalculationMethod,
      prayerMadhab: model.prayerMadhab,
      dailyAvailableTime: model.dailyAvailableTime,
      globalPracticeLevel: model.globalPracticeLevel,
      prayerPracticeLevel: model.prayerPracticeLevel,
      quranPracticeLevel: model.quranPracticeLevel,
      dhikrPractices: model.dhikrPractices,
      fastingPracticeLevel: model.fastingPracticeLevel,
      socialActionsFrequency: model.socialActionsFrequency,
      regularityDuration: model.regularityDuration,
      islamicKnowledgeLevel: model.islamicKnowledgeLevel,
      mainIntention: model.mainIntention ?? mainIntentions[0] ?? null,
      mainIntentions,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  static toDtoList(models: UserPreferenceModel[]) {
    return models.map((model) => this.toDto(model));
  }
}
