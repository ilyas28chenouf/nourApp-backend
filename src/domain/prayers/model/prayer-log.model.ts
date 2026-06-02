import { PrayerMode } from '../enums/prayer-mode.enum';
import { PrayerName } from '../enums/prayer-name.enum';
import { PrayerStatus } from '../enums/prayer-status.enum';
export interface PrayerLogModel {
  id: string;
  userId: string;
  prayerDate: string;
  prayerName: PrayerName;
  status: PrayerStatus;
  prayedAt?: Date | null;
  wasOnTime: boolean;
  prayerMode?: PrayerMode | null;
  isSupererogatory: boolean;
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
