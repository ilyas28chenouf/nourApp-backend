import { PrayerTimeModel } from '../model/prayer-time.model';
export const PRAYER_TIMES_PERSISTENCE_PORT = Symbol('PRAYER_TIMES_PERSISTENCE_PORT');
export interface PrayerTimesPersistencePort { findByUserAndDate(userId: string, prayerDate: string): Promise<PrayerTimeModel | null>; }
