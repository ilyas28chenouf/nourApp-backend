import {
  optionalNullableDateTime,
  requireDateOnly,
} from '../../common-utils/dates/date-format.util';

export class CreatePrayerLogUsecase {
  constructor(
    private readonly prayerLogs: import('../../domain/prayers/ports/prayer-logs-persistence.port').PrayerLogsPersistencePort,
  ) {}
  execute(userId: string, data: any) {
    return this.prayerLogs.create({
      ...data,
      userId,
      prayerDate: requireDateOnly(data.prayerDate, 'prayerDate'),
      prayedAt: optionalNullableDateTime(data.prayedAt, 'prayedAt'),
    });
  }
}
