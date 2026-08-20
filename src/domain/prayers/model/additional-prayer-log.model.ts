import { AdditionalPrayerTime } from '../enums/additional-prayer-time.enum';

export interface AdditionalPrayerLogModel {
  id: string;
  userId: string;
  prayerDate: string;
  prayerTime: AdditionalPrayerTime;
  rakaat: number;
  createdAt?: Date;
  updatedAt?: Date;
}
