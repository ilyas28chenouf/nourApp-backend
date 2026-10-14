import { PrayerMadhab } from '../../../domain/users/enums/prayer-madhab.enum';
import { toUmmahPrayerMadhab } from './ummah-prayer-madhab';

describe('toUmmahPrayerMadhab', () => {
  it.each([
    [PrayerMadhab.SHAFI, PrayerMadhab.SHAFI],
    [PrayerMadhab.HANAFI, PrayerMadhab.HANAFI],
    [PrayerMadhab.MALIKI, PrayerMadhab.SHAFI],
    [PrayerMadhab.HANBALI, PrayerMadhab.SHAFI],
  ])('maps stored %s to provider %s', (stored, provider) => {
    expect(toUmmahPrayerMadhab(stored)).toBe(provider);
  });

  it('never forwards an unknown legacy value to Ummah', () => {
    expect(toUmmahPrayerMadhab('unsupported')).toBe(PrayerMadhab.SHAFI);
  });
});
