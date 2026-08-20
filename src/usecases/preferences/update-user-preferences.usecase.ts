import { UserPreferencesPersistencePort } from '../../domain/users/ports/user-preferences-persistence.port';
import { AppLoggerService } from '../../infrastructure/logger/app-logger.service';

export class UpdateUserPreferencesUsecase {
  constructor(
    private readonly preferences: UserPreferencesPersistencePort,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(userId: string, data: Record<string, unknown>) {
    const pref =
      (await this.preferences.findByUserId(userId)) ??
      (await this.preferences.create({
        userId,
        language: 'fr',
        prayerCalculationMethod: 'Algeria',
        prayerMadhab: 'Shafi',
      }));
    const updatePayload = this.pickDefined(data, [
      'theme',
      'language',
      'prayerNotificationsEnabled',
      'fastingNotificationsEnabled',
      'dhikrNotificationsEnabled',
      'quranNotificationsEnabled',
      'activityNotificationsEnabled',
      'encouragementNotificationsEnabled',
      'dailyReminderEnabled',
      'dailyReminderTime',
      'prayerCalculationMethod',
      'prayerMadhab',
      'dailyAvailableTime',
      'globalPracticeLevel',
      'prayerPracticeLevel',
      'quranPracticeLevel',
      'dhikrPractices',
      'fastingPracticeLevel',
      'socialActionsFrequency',
      'regularityDuration',
      'islamicKnowledgeLevel',
      'mainIntentions',
    ]);
    this.normalizeMainIntentions(data, updatePayload);
    const updated = await this.preferences.update(pref.id, updatePayload);
    this.logger.debug('Preferences updated', {
      userId,
      updatedFields: Object.keys(updatePayload),
    });
    return updated;
  }

  private pickDefined(data: Record<string, unknown>, fields: string[]) {
    return Object.fromEntries(
      fields
        .filter((field) => data[field] !== undefined)
        .map((field) => [field, data[field]]),
    );
  }

  private normalizeMainIntentions(
    data: Record<string, unknown>,
    updatePayload: Record<string, unknown>,
  ) {
    const value = data.mainIntentions ?? data.mainIntention;
    if (value === undefined) return;
    const mainIntentions = (Array.isArray(value) ? value : [value]).filter(
      (item): item is string => typeof item === 'string',
    );
    updatePayload.mainIntentions = mainIntentions;
    updatePayload.mainIntention = mainIntentions[0] ?? null;
  }
}
