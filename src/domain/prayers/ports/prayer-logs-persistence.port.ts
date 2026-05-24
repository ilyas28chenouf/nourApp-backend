import { PrayerLogModel } from '../model/prayer-log.model';
export const PRAYER_LOGS_PERSISTENCE_PORT = Symbol('PRAYER_LOGS_PERSISTENCE_PORT');
export interface PrayerLogsPersistencePort { findByUserId(userId: string): Promise<PrayerLogModel[]>; findById(id: string): Promise<PrayerLogModel | null>; create(data: Partial<PrayerLogModel>): Promise<PrayerLogModel>; update(id: string, data: Partial<PrayerLogModel>): Promise<PrayerLogModel>; }
