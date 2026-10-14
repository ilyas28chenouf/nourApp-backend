import { PrayerMadhab } from '../../../domain/users/enums/prayer-madhab.enum';

export type UmmahPrayerMadhab = PrayerMadhab.SHAFI | PrayerMadhab.HANAFI;

/**
 * Ummah only uses the madhhab setting to choose the Asr calculation.
 * Keep the user's persisted preference unchanged and map only at this boundary.
 */
export function toUmmahPrayerMadhab(
  madhab: PrayerMadhab | string | null | undefined,
): UmmahPrayerMadhab {
  return madhab === PrayerMadhab.HANAFI
    ? PrayerMadhab.HANAFI
    : PrayerMadhab.SHAFI;
}
