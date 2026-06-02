export interface PrayerTimesProviderRequest {
  latitude: number | string;
  longitude: number | string;
  date: string;
  method: string;
  madhab: string;
  timezone: string;
}

export interface PrayerTimesProviderPort {
  fetchPrayerTimes(
    request: PrayerTimesProviderRequest,
  ): Promise<Record<string, any>>;
  fetchPrayerMethods(): Promise<Record<string, any>>;
}
