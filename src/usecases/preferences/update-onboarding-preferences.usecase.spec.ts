import { UserPreferencesPersistencePort } from '../../domain/users/ports/user-preferences-persistence.port';
import { AppLoggerService } from '../../infrastructure/logger/app-logger.service';
import { UpdateOnboardingPreferencesUsecase } from './update-onboarding-preferences.usecase';

describe('UpdateOnboardingPreferencesUsecase', () => {
  const preference = {
    id: 'preference-id',
    userId: 'user-id',
    theme: 'default',
    language: 'fr',
    prayerNotificationsEnabled: true,
    fastingNotificationsEnabled: true,
    dhikrNotificationsEnabled: true,
    quranNotificationsEnabled: true,
    encouragementNotificationsEnabled: true,
    dailyReminderEnabled: true,
    dailyReminderTime: '09:00',
    prayerCalculationMethod: 'Algeria',
    prayerMadhab: 'Shafi',
  };

  it('persists non-empty dhikrPractices during onboarding updates', async () => {
    const preferences = {
      findByUserId: jest.fn().mockResolvedValue(preference),
      create: jest.fn(),
      update: jest.fn().mockImplementation((id, data) =>
        Promise.resolve({
          ...preference,
          id,
          ...data,
        }),
      ),
    } as unknown as jest.Mocked<UserPreferencesPersistencePort>;
    const logger = {
      debug: jest.fn(),
    } as unknown as AppLoggerService;
    const usecase = new UpdateOnboardingPreferencesUsecase(preferences, logger);

    const result = await usecase.execute('user-id', {
      dhikrPractices: ['Adhkar du matin — Sabah'],
      globalPracticeLevel: 'Je recommence',
      ignoredField: 'ignored',
    });

    expect(preferences.update.mock.calls[0]).toEqual([
      'preference-id',
      {
        globalPracticeLevel: 'Je recommence',
        dhikrPractices: ['Adhkar du matin — Sabah'],
      },
    ]);
    expect(result.dhikrPractices).toEqual(['Adhkar du matin — Sabah']);
    expect(result).not.toHaveProperty('ignoredField');
  });
});
