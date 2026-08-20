import { FastingStatus } from '../domain/fasting/enums/fasting-status.enum';
import { FastingType } from '../domain/fasting/enums/fasting-type.enum';
import { ReadingPeriod } from '../domain/quran/enums/reading-period.enum';
import { ResourceType } from '../domain/resources/enums/resource-type.enum';
import { GetFastingSummaryUsecase } from './fasting/get-fasting-summary.usecase';
import { GetQuranSummaryUsecase } from './quran/get-quran-summary.usecase';
import { GetDailyResourcesUsecase } from './resources/get-daily-resources.usecase';

describe('v1.6 typed summaries and deterministic daily resources', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-08-20T12:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('builds fasting sections from recommended-day data and excludes Ramadan from Sunnah', async () => {
    const persistence = {
      findLogsByUserId: jest
        .fn()
        .mockResolvedValue([
          fastingLog('monday', '2026-08-17', FastingType.MONDAY),
          fastingLog('white', '2026-08-19', FastingType.WHITE_DAYS),
          fastingLog('ramadan', '2026-08-20', FastingType.RAMADAN),
        ]),
      findRecommendedDays: jest
        .fn()
        .mockResolvedValue([
          recommended('2026-08-17', FastingType.MONDAY),
          recommended('2026-08-19', FastingType.WHITE_DAYS),
          recommended('2026-08-20', FastingType.RAMADAN),
        ]),
    };

    const result = await new GetFastingSummaryUsecase(
      persistence as never,
    ).execute('user-1', 'WEEK');

    expect(result).toMatchObject({
      period: 'WEEK',
      from: '2026-08-17',
      to: '2026-08-23',
      totalFasted: 3,
      mondayThursday: {
        applicable: true,
        available: 1,
        fasted: 1,
        percentage: 100,
      },
      whiteDays: {
        applicable: true,
        available: 1,
        fasted: 1,
        percentage: 100,
      },
      otherSunnah: {
        applicable: false,
        available: 0,
        fasted: 0,
        percentage: 0,
      },
    });
  });

  it('keeps MORNING, EVENING and historical DAY Quran totals distinct', async () => {
    const persistence = {
      findLogsByUserId: jest
        .fn()
        .mockResolvedValue([
          quranLog('morning', ReadingPeriod.MORNING, 4, 0.5),
          quranLog('evening', ReadingPeriod.EVENING, 2, 0.25),
          quranLog('day', ReadingPeriod.DAY, 3, 0.5),
        ]),
    };

    const result = await new GetQuranSummaryUsecase(
      persistence as never,
    ).execute('user-1', 'WEEK');

    expect(result).toMatchObject({
      totalPages: 9,
      totalHizb: 1.25,
      readingPeriods: {
        MORNING: { count: 1, pages: 4, hizb: 0.5 },
        EVENING: { count: 1, pages: 2, hizb: 0.25 },
        DAY: { count: 1, pages: 3, hizb: 0.5 },
      },
      pagesCount: 9,
    });
  });

  it('selects the same approved resource for the same date', async () => {
    const resources = [
      resource('verse-b', ResourceType.VERSE),
      resource('verse-a', ResourceType.VERSE),
      resource('hadith-a', ResourceType.HADITH),
    ];
    const usecase = new GetDailyResourcesUsecase({
      findActive: jest.fn().mockResolvedValue(resources),
    } as never);

    const first = await usecase.execute('2026-08-20');
    const second = await usecase.execute('2026-08-20');

    expect(first).toEqual(second);
    expect(first.date).toBe('2026-08-20');
    expect(first.verseOfTheDay).not.toBeNull();
    expect(first.hadithOfTheDay).not.toBeNull();
    expect(first.wisdomOfTheDay).toBeNull();
  });
});

function fastingLog(id: string, fastingDate: string, fastingType: FastingType) {
  return {
    id,
    userId: 'user-1',
    fastingDate,
    fastingType,
    status: FastingStatus.FASTED,
  };
}

function recommended(date: string, type: FastingType) {
  return { id: `${date}:${type}`, date, type, title: type };
}

function quranLog(
  id: string,
  readingPeriod: ReadingPeriod,
  pagesCount: number,
  hizbCount: number,
) {
  return {
    id,
    userId: 'user-1',
    readingDate: '2026-08-20',
    pagesCount,
    hizbCount,
    readingPeriod,
    objectiveReached: false,
  };
}

function resource(id: string, type: ResourceType) {
  return {
    id,
    title: id,
    type,
    language: 'fr',
    isActive: true,
  };
}
