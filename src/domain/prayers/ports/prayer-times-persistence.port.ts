import { PrayerTimeModel } from '../model/prayer-time.model';
export const PRAYER_TIMES_PERSISTENCE_PORT = Symbol(
  'PRAYER_TIMES_PERSISTENCE_PORT',
);
export interface PrayerTimesPersistencePort {
  findCached(
    userId: string,
    prayerDate: string,
    calculationMethod: string,
    madhab: string,
    timezone: string,
  ): Promise<PrayerTimeModel | null>;
  create(data: Partial<PrayerTimeModel>): Promise<PrayerTimeModel>;
}
