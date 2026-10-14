import { BadGatewayException } from '@nestjs/common';
import { PrayerTimesPersistencePort } from '../../domain/prayers/ports/prayer-times-persistence.port';
import { PrayerTimesProviderPort } from '../../domain/prayers/ports/prayer-times-provider.port';
import { UserPreferencesPersistencePort } from '../../domain/users/ports/user-preferences-persistence.port';
import { UsersPersistencePort } from '../../domain/users/ports/users-persistence.port';
import { PrayerMadhab } from '../../domain/users/enums/prayer-madhab.enum';
import { GetPrayerTimesUsecase } from './get-prayer-times.usecase';

describe('GetPrayerTimesUsecase madhhab persistence', () => {
  const user = {
    id: 'user-id',
    latitude: 48.8566,
    longitude: 2.3522,
    timezone: 'Europe/Paris',
    city: 'Paris',
    country: 'France',
  };
  const providerResponse = {
    success: true,
    data: {
      date: '2026-10-14',
      timezone: 'Europe/Paris',
      calculation_method: 'France',
      madhab: 'Shafi',
      prayer_times: {
        fajr: '06:15',
        dhuhr: '13:35',
        asr: '16:30',
        maghrib: '19:04',
        isha: '20:25',
      },
    },
  };

  function createHarness(
    prayerMadhab: PrayerMadhab,
    fetchPrayerTimes = jest.fn().mockResolvedValue(providerResponse),
  ) {
    const createPrayerTime = jest
      .fn()
      .mockImplementation((data: Record<string, unknown>) =>
        Promise.resolve({ id: 'prayer-time-id', ...data }),
      );
    const prayerTimes = {
      findCached: jest.fn().mockResolvedValue(null),
      create: createPrayerTime,
    } as unknown as PrayerTimesPersistencePort;
    const users = {
      findById: jest.fn().mockResolvedValue(user),
    } as unknown as UsersPersistencePort;
    const updatePreferences = jest.fn();
    const preferences = {
      findByUserId: jest.fn().mockResolvedValue({
        id: 'preference-id',
        userId: user.id,
        language: 'en',
        prayerCalculationMethod: 'France',
        prayerMadhab,
      }),
      create: jest.fn(),
      update: updatePreferences,
    } as unknown as UserPreferencesPersistencePort;
    const provider = {
      fetchPrayerTimes,
    } as unknown as PrayerTimesProviderPort;

    return {
      prayerTimes,
      preferences,
      createPrayerTime,
      updatePreferences,
      fetchPrayerTimes,
      usecase: new GetPrayerTimesUsecase(
        prayerTimes,
        users,
        preferences,
        provider,
      ),
    };
  }

  it.each(Object.values(PrayerMadhab))(
    'keeps stored %s distinct from the provider response',
    async (prayerMadhab) => {
      const harness = createHarness(prayerMadhab);
      const result = await harness.usecase.execute(user.id, '2026-10-14');

      expect(harness.fetchPrayerTimes).toHaveBeenCalledWith(
        expect.objectContaining({ madhab: prayerMadhab }),
      );
      expect(harness.createPrayerTime).toHaveBeenCalledWith(
        expect.objectContaining({ madhab: prayerMadhab }),
      );
      expect(result.madhab).toBe(prayerMadhab);
    },
  );

  it('does not modify the stored preference when the provider fails', async () => {
    const harness = createHarness(
      PrayerMadhab.MALIKI,
      jest.fn().mockRejectedValue(new Error('provider unavailable')),
    );

    await expect(
      harness.usecase.execute(user.id, '2026-10-14'),
    ).rejects.toBeInstanceOf(BadGatewayException);
    expect(harness.updatePreferences).not.toHaveBeenCalled();
    expect(harness.createPrayerTime).not.toHaveBeenCalled();
  });
});
