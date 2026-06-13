import {
  toSafeDateOnly,
  toSafeIsoDateTime,
} from '../../../common-utils/dates/date-format.util';
import { PrayerTimeModel } from '../../../domain/prayers/model/prayer-time.model';

export class PrayerResponseMapper {
  static toDto<T>(model: T): T {
    if (Array.isArray(model)) return this.toDtoList(model) as T;
    if (model && typeof model === 'object' && 'prayerDate' in model) {
      const prayerLog = model as Record<string, unknown>;
      return {
        ...prayerLog,
        prayerDate: toSafeDateOnly(prayerLog.prayerDate),
        prayedAt: toSafeIsoDateTime(prayerLog.prayedAt),
        createdAt: toSafeIsoDateTime(prayerLog.createdAt),
        updatedAt: toSafeIsoDateTime(prayerLog.updatedAt),
      } as T;
    }
    return model;
  }

  static toPrayerTimeDto(model: PrayerTimeModel) {
    return {
      id: model.id,
      prayerDate: model.prayerDate,
      timezone: model.timezone,
      city: model.city,
      country: model.country,
      latitude: model.latitude,
      longitude: model.longitude,
      calculationMethod: model.calculationMethod,
      madhab: model.madhab,
      prayerTimes: {
        imsak: model.imsak,
        fajr: model.fajr,
        sunrise: model.sunrise,
        dhuhr: model.dhuhr,
        asr: model.asr,
        maghrib: model.maghrib,
        isha: model.isha,
      },
      prayerDateTimes: {
        imsak: model.imsakDateTime,
        fajr: model.fajrDateTime,
        sunrise: model.sunriseDateTime,
        dhuhr: model.dhuhrDateTime,
        asr: model.asrDateTime,
        maghrib: model.maghribDateTime,
        isha: model.ishaDateTime,
      },
      currentStatus: {
        currentPrayer: model.currentPrayer,
        nextPrayer: model.nextPrayer,
        timeUntilNext: model.timeUntilNext,
        minutesUntilNext: model.minutesUntilNext,
      },
      source: model.source,
      createdAt: toSafeIsoDateTime(model.createdAt),
      updatedAt: toSafeIsoDateTime(model.updatedAt),
    };
  }

  static toDtoList<T>(models: T[]): T[] {
    return models.map((model) => this.toDto(model));
  }
}
