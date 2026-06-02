export interface PrayerTimeModel {
  id: string;
  userId: string;
  prayerDate: string;
  fajrTime: Date;
  dhuhrTime: Date;
  asrTime: Date;
  maghribTime: Date;
  ishaTime: Date;
  source: string;
  city?: string | null;
  country?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  createdAt?: Date;
}
