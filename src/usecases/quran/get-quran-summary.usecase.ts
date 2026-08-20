import { resolveCalendarRange } from '../../common-utils/dates/calendar-period.util';
import { ReadingPeriod } from '../../domain/quran/enums/reading-period.enum';

export class GetQuranSummaryUsecase {
  constructor(
    private readonly persistence: import('../../domain/quran/ports/quran-persistence.port').QuranPersistencePort,
  ) {}
  async execute(userId: string, period: string) {
    const range = resolveCalendarRange(period);
    const logs = (await this.persistence.findLogsByUserId(userId)).filter(
      (log) => log.readingDate >= range.from && log.readingDate <= range.to,
    );
    const summarize = (readingPeriod: ReadingPeriod) => {
      const matching = logs.filter(
        (log) => (log.readingPeriod ?? ReadingPeriod.DAY) === readingPeriod,
      );
      return {
        count: matching.length,
        pages: matching.reduce(
          (sum, log) => sum + Number(log.pagesCount ?? 0),
          0,
        ),
        hizb: matching.reduce(
          (sum, log) => sum + Number(log.hizbCount ?? 0),
          0,
        ),
      };
    };
    const totalPages = logs.reduce(
      (sum, log) => sum + Number(log.pagesCount ?? 0),
      0,
    );
    return {
      ...range,
      totalPages,
      totalHizb: logs.reduce((sum, log) => sum + Number(log.hizbCount ?? 0), 0),
      readingPeriods: {
        [ReadingPeriod.MORNING]: summarize(ReadingPeriod.MORNING),
        [ReadingPeriod.EVENING]: summarize(ReadingPeriod.EVENING),
        [ReadingPeriod.DAY]: summarize(ReadingPeriod.DAY),
      },
      // Compatibility aliases kept for existing clients.
      pagesCount: totalPages,
      objectivesReached: logs.filter((log) => log.objectiveReached).length,
    };
  }
}
