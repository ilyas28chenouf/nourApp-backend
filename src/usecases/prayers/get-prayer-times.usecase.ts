import { BadGatewayException, BadRequestException } from '@nestjs/common';
import { PrayerTimeModel } from '../../domain/prayers/model/prayer-time.model';
import { PrayerTimesPersistencePort } from '../../domain/prayers/ports/prayer-times-persistence.port';
import { PrayerTimesProviderPort } from '../../domain/prayers/ports/prayer-times-provider.port';
import { UserPreferencesPersistencePort } from '../../domain/users/ports/user-preferences-persistence.port';
import { UsersPersistencePort } from '../../domain/users/ports/users-persistence.port';

export class GetPrayerTimesUsecase {
  constructor(
    private readonly prayerTimes: PrayerTimesPersistencePort,
    private readonly users: UsersPersistencePort,
    private readonly preferences: UserPreferencesPersistencePort,
    private readonly provider: PrayerTimesProviderPort,
  ) {}

  async execute(userId: string, date: string): Promise<PrayerTimeModel> {
    if (!date) {
      throw new BadRequestException('date query parameter is required');
    }

    const user = await this.users.findById(userId);
    if (!user?.latitude || !user.longitude || !user.timezone) {
      throw new BadRequestException(
        'User location and timezone are required to calculate prayer times',
      );
    }

    const preferences =
      (await this.preferences.findByUserId(userId)) ??
      (await this.preferences.create({
        userId,
        language: user.language ?? 'fr',
        prayerCalculationMethod: 'Algeria',
        prayerMadhab: 'Shafi',
      }));

    const calculationMethod =
      preferences.prayerCalculationMethod?.trim() || 'Algeria';
    const madhab = preferences.prayerMadhab || 'Shafi';

    const cached = await this.prayerTimes.findCached(
      userId,
      date,
      calculationMethod,
      madhab,
      user.timezone,
    );
    if (cached) {
      return cached;
    }

    let response: Record<string, any>;
    try {
      response = await this.provider.fetchPrayerTimes({
        latitude: user.latitude,
        longitude: user.longitude,
        date,
        method: calculationMethod,
        madhab,
        timezone: user.timezone,
      });
    } catch {
      throw new BadGatewayException(
        'Unable to fetch prayer times from provider',
      );
    }

    const data = response.data as Record<string, any> | undefined;
    const prayerTimes = data?.prayer_times as
      | Record<string, string>
      | undefined;
    const prayerDateTimes = data?.prayer_datetimes as
      | Record<string, string>
      | undefined;
    const currentStatus = data?.current_status as
      | Record<string, string | number>
      | undefined;

    if (response.success === false || !data || !prayerTimes) {
      throw new BadGatewayException(
        'Unable to fetch prayer times from provider',
      );
    }

    return this.prayerTimes.create({
      userId,
      prayerDate: String(data.date ?? date),
      timezone: String(data.timezone ?? user.timezone),
      city: user.city,
      country: user.country,
      latitude: user.latitude,
      longitude: user.longitude,
      calculationMethod: String(data.calculation_method ?? calculationMethod),
      madhab: String(data.madhab ?? madhab),
      imsak: prayerTimes.imsak,
      fajr: prayerTimes.fajr,
      sunrise: prayerTimes.sunrise,
      dhuhr: prayerTimes.dhuhr,
      asr: prayerTimes.asr,
      maghrib: prayerTimes.maghrib,
      isha: prayerTimes.isha,
      imsakDateTime: prayerDateTimes?.imsak,
      fajrDateTime: prayerDateTimes?.fajr,
      sunriseDateTime: prayerDateTimes?.sunrise,
      dhuhrDateTime: prayerDateTimes?.dhuhr,
      asrDateTime: prayerDateTimes?.asr,
      maghribDateTime: prayerDateTimes?.maghrib,
      ishaDateTime: prayerDateTimes?.isha,
      currentPrayer: currentStatus?.current_prayer
        ? String(currentStatus.current_prayer)
        : null,
      nextPrayer: currentStatus?.next_prayer
        ? String(currentStatus.next_prayer)
        : null,
      timeUntilNext: currentStatus?.time_until_next
        ? String(currentStatus.time_until_next)
        : null,
      minutesUntilNext:
        typeof currentStatus?.minutes_until_next === 'number'
          ? currentStatus.minutes_until_next
          : null,
      source: 'UMMAH_API',
      rawResponse: response,
    });
  }
}
