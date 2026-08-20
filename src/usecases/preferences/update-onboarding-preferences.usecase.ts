import { UserPreferencesPersistencePort } from '../../domain/users/ports/user-preferences-persistence.port';
import { AppLoggerService } from '../../infrastructure/logger/app-logger.service';

export class UpdateOnboardingPreferencesUsecase {
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
    const updatePayload = Object.fromEntries(
      [
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
      ]
        .filter((field) => data[field] !== undefined)
        .map((field) => [field, data[field]]),
    );
    this.normalizeMainIntentions(data, updatePayload);
    this.logger.debug('Onboarding preferences sanitized update payload', {
      userId,
      updatePayload,
    });
    const updated = await this.preferences.update(pref.id, updatePayload);
    this.logger.debug('Onboarding preferences updated', {
      userId,
      updatedFields: Object.keys(updatePayload),
    });
    return updated;
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
