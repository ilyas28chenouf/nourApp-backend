import { resolveCalendarRange } from '../../common-utils/dates/calendar-period.util';
import { FastingStatus } from '../../domain/fasting/enums/fasting-status.enum';
import { FastingType } from '../../domain/fasting/enums/fasting-type.enum';

export class GetFastingSummaryUsecase {
  constructor(
    private readonly persistence: import('../../domain/fasting/ports/fasting-persistence.port').FastingPersistencePort,
  ) {}
  async execute(userId: string, period: string) {
    const range = resolveCalendarRange(period);
    const [allLogs, recommendedDays] = await Promise.all([
      this.persistence.findLogsByUserId(userId),
      this.persistence.findRecommendedDays(),
    ]);
    const logs = allLogs.filter(
      (log) => log.fastingDate >= range.from && log.fastingDate <= range.to,
    );
    const recommendations = recommendedDays.filter(
      (day) => day.date >= range.from && day.date <= range.to,
    );
    const fastedDates = new Set(
      logs
        .filter((log) => log.status === FastingStatus.FASTED)
        .map((log) => log.fastingDate),
    );
    const section = (types: FastingType[]) => {
      const dates = new Set(
        recommendations
          .filter((day) => types.includes(day.type))
          .map((day) => day.date),
      );
      const fasted = [...dates].filter((date) => fastedDates.has(date)).length;
      return {
        applicable: dates.size > 0,
        available: dates.size,
        fasted,
        percentage:
          dates.size === 0 ? 0 : Math.round((fasted / dates.size) * 100),
      };
    };
    const otherSunnahTypes = Object.values(FastingType).filter(
      (type) =>
        ![
          FastingType.MONDAY,
          FastingType.THURSDAY,
          FastingType.WHITE_DAYS,
          FastingType.RAMADAN,
        ].includes(type),
    );
    const totalFasted = logs.filter(
      (log) => log.status === FastingStatus.FASTED,
    ).length;
    return {
      ...range,
      totalFasted,
      mondayThursday: section([FastingType.MONDAY, FastingType.THURSDAY]),
      whiteDays: section([FastingType.WHITE_DAYS]),
      otherSunnah: section(otherSunnahTypes),
      // Compatibility aliases kept for existing clients.
      total: logs.length,
      fasted: totalFasted,
      planned: logs.filter((log) => log.status === FastingStatus.PLANNED)
        .length,
    };
  }
}
