import { ConfigService } from '@nestjs/config';
import { PrayerMadhab } from '../../../domain/users/enums/prayer-madhab.enum';
import { AppLoggerService } from '../../logger/app-logger.service';
import { UmmahPrayerTimesClient } from './ummah-prayer-times.client';

describe('UmmahPrayerTimesClient', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it.each([
    [PrayerMadhab.SHAFI, PrayerMadhab.SHAFI],
    [PrayerMadhab.HANAFI, PrayerMadhab.HANAFI],
    [PrayerMadhab.MALIKI, PrayerMadhab.SHAFI],
    [PrayerMadhab.HANBALI, PrayerMadhab.SHAFI],
  ])('sends stored %s to Ummah as %s', async (stored, provider) => {
    const fetchMock = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true, data: {} }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );
    global.fetch = fetchMock;

    const config = {
      get: jest.fn().mockReturnValue('https://provider.example/api'),
    } as unknown as ConfigService;
    const logger = { error: jest.fn() } as unknown as AppLoggerService;
    const client = new UmmahPrayerTimesClient(config, logger);

    await client.fetchPrayerTimes({
      latitude: 48.8566,
      longitude: 2.3522,
      date: '2026-10-14',
      method: 'France',
      madhab: stored,
      timezone: 'Europe/Paris',
    });

    const requestedUrl = new URL(String(fetchMock.mock.calls[0][0]));
    expect(requestedUrl.searchParams.get('madhab')).toBe(provider);
    expect(requestedUrl.searchParams.get('madhab')).not.toBe('Maliki');
    expect(requestedUrl.searchParams.get('madhab')).not.toBe('Hanbali');
  });
});
