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
        'mainIntention',
      ]
        .filter((field) => data[field] !== undefined)
        .map((field) => [field, data[field]]),
    );
    const updated = await this.preferences.update(pref.id, updatePayload);
    this.logger.debug('Onboarding preferences updated', {
      userId,
      updatedFields: Object.keys(updatePayload),
    });
    return updated;
  }
}
