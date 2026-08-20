import { PrayerLogModel } from '../model/prayer-log.model';
import { AdditionalPrayerLogModel } from '../model/additional-prayer-log.model';
export const PRAYER_LOGS_PERSISTENCE_PORT = Symbol(
  'PRAYER_LOGS_PERSISTENCE_PORT',
);
export interface PrayerLogsPersistencePort {
  findByUserId(userId: string): Promise<PrayerLogModel[]>;
  findById(id: string): Promise<PrayerLogModel | null>;
  findAdditionalByUserId(userId: string): Promise<AdditionalPrayerLogModel[]>;
  create(data: Partial<PrayerLogModel>): Promise<PrayerLogModel>;
  update(id: string, data: Partial<PrayerLogModel>): Promise<PrayerLogModel>;
  delete(id: string): Promise<void>;
}
