import type { DataSource, Repository } from 'typeorm';
import { CharityActionType } from '../../domain/charity/enums/charity-action-type.enum';
import { DhikrPeriod } from '../../domain/dhikr/enums/dhikr-period.enum';
import { DhikrSessionType } from '../../domain/dhikr/enums/dhikr-session-type.enum';
import { FastingStatus } from '../../domain/fasting/enums/fasting-status.enum';
import { FastingType } from '../../domain/fasting/enums/fasting-type.enum';
import { AdditionalPrayerTime } from '../../domain/prayers/enums/additional-prayer-time.enum';
import { PrayerMode } from '../../domain/prayers/enums/prayer-mode.enum';
import { PrayerName } from '../../domain/prayers/enums/prayer-name.enum';
import { PrayerStatus } from '../../domain/prayers/enums/prayer-status.enum';
import { HasanatSourceType } from '../../domain/progression/enums/hasanat-source-type.enum';
import { HasanatPointEventTypeormEntity } from '../../infrastructure/progression/entities/hasanat-point-event.typeorm-entity';
import { ProgressionService } from './progression.service';

describe('ProgressionService point-event idempotency', () => {
  let events: HasanatPointEventTypeormEntity[];
  let service: ProgressionService;

  beforeEach(() => {
    events = [];
    const eventRepository = {
      find: jest.fn().mockImplementation(() => Promise.resolve([...events])),
      create: jest.fn().mockImplementation((input) => ({
        ...input,
        id: `event-${events.length + 1}`,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
      })),
      save: jest.fn().mockImplementation((event) => {
        const index = events.findIndex((item) => item.id === event.id);
        if (index >= 0) events[index] = event;
        else events.push(event);
        return Promise.resolve(event);
      }),
    } as unknown as Repository<HasanatPointEventTypeormEntity>;
    const dataSource = {
      getRepository: jest.fn().mockReturnValue(eventRepository),
    } as unknown as DataSource;

    service = new ProgressionService(dataSource);
    jest
      .spyOn(service as any, 'recalculateProgression')
      .mockResolvedValue(undefined);
  });

  const prayerLog = () => ({
    id: '11111111-1111-1111-1111-111111111111',
    userId: '22222222-2222-2222-2222-222222222222',
    prayerDate: '2026-09-04',
    prayerName: PrayerName.FAJR,
    status: PrayerStatus.DONE,
    prayedAt: null,
    wasOnTime: true,
    prayerMode: PrayerMode.GROUP_PHYSICAL,
    isSupererogatory: false,
    prayedAtMosque: true,
    notes: null,
  });

  it('keeps one 20-point contribution across repeated updates, then reconciles changes and deletion', async () => {
    const log = prayerLog();

    await service.recordPrayerLog(log);
    await service.recordPrayerLog(log);

    expect(events).toHaveLength(1);
    expect(events.reduce((total, event) => total + event.points, 0)).toBe(20);

    await service.recordPrayerLog({
      ...log,
      status: PrayerStatus.LATE,
      wasOnTime: false,
    });

    expect(events).toHaveLength(1);
    expect(events.reduce((total, event) => total + event.points, 0)).toBe(10);

    await service.reverseEventsForLog(
      log.userId,
      HasanatSourceType.PRAYER,
      log.id,
      log.prayerDate,
    );

    expect(events).toHaveLength(2);
    expect(events.reduce((total, event) => total + event.points, 0)).toBe(0);

    await service.recordPrayerLog({
      ...log,
      status: PrayerStatus.LATE,
      wasOnTime: false,
    });

    expect(events).toHaveLength(2);
    expect(events.reduce((total, event) => total + event.points, 0)).toBe(10);
  });

  it('reconciles a legacy event without deleting point history', async () => {
    const log = prayerLog();
    events.push({
      id: 'legacy-event',
      userId: log.userId,
      sourceType: HasanatSourceType.PRAYER,
      sourceId: log.id,
      actionKey: 'PRAYER_ON_TIME_FARD',
      points: 25,
      eventDate: log.prayerDate,
      metadata: {},
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    await service.recordPrayerLog(log);
    await service.recordPrayerLog(log);

    expect(events).toHaveLength(2);
    expect(events.find((event) => event.id === 'legacy-event')?.points).toBe(
      25,
    );
    expect(events.reduce((total, event) => total + event.points, 0)).toBe(20);
  });

  it('updates additional-prayer points per rakah without duplicate awards', async () => {
    const log = {
      id: '33333333-3333-3333-3333-333333333333',
      userId: '22222222-2222-2222-2222-222222222222',
      prayerDate: '2026-09-04',
      prayerTime: AdditionalPrayerTime.NIGHT,
      rakaat: 2,
    };

    await service.setAdditionalPrayerReward(log);
    await service.setAdditionalPrayerReward(log);
    expect(events).toHaveLength(1);
    expect(events.reduce((total, event) => total + event.points, 0)).toBe(10);

    await service.setAdditionalPrayerReward({ ...log, rakaat: 8 });
    expect(events).toHaveLength(1);
    expect(events.reduce((total, event) => total + event.points, 0)).toBe(40);
  });

  it('recalculates the legacy additional-prayer aggregate in place', async () => {
    const log = {
      id: '33333333-3333-3333-3333-333333333333',
      userId: '22222222-2222-2222-2222-222222222222',
      prayerDate: '2026-09-04',
      prayerTime: AdditionalPrayerTime.NIGHT,
      rakaat: 2,
    };
    events.push({
      id: 'legacy-additional-event',
      userId: log.userId,
      sourceType: HasanatSourceType.PRAYER,
      sourceId: null,
      actionKey: `additional_prayer:${log.prayerTime}:${log.userId}:${log.prayerDate}`,
      points: 40,
      eventDate: log.prayerDate,
      metadata: {},
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    await service.setAdditionalPrayerReward(log);

    expect(events).toHaveLength(1);
    expect(events[0].points).toBe(10);
  });

  it('scores a Tahajjud prayer only from its recorded rakah count', async () => {
    await service.recordPrayerLog({
      ...prayerLog(),
      prayerName: PrayerName.TAHAJJUD,
      isSupererogatory: true,
      rakaat: 2,
    });

    expect(events.reduce((total, event) => total + event.points, 0)).toBe(10);
  });

  it('updates Quran points without an objective bonus or duplicate award', async () => {
    const log = {
      id: '44444444-4444-4444-4444-444444444444',
      userId: '22222222-2222-2222-2222-222222222222',
      readingDate: '2026-09-04',
      pagesCount: 10,
      hizbCount: 2,
      objectiveReached: true,
    };

    await service.recordQuranReadingLog(log);
    await service.recordQuranReadingLog(log);
    expect(events).toHaveLength(1);
    expect(events.reduce((total, event) => total + event.points, 0)).toBe(150);

    await service.recordQuranReadingLog({ ...log, pagesCount: 5 });
    expect(events.reduce((total, event) => total + event.points, 0)).toBe(75);
  });

  it('reverses fasting and dhikr contributions when completion is removed', async () => {
    const fastingLog = {
      id: '55555555-5555-5555-5555-555555555555',
      userId: '22222222-2222-2222-2222-222222222222',
      fastingDate: '2026-09-04',
      fastingType: FastingType.MONDAY,
      status: FastingStatus.FASTED,
    };

    await service.recordFastingLog(fastingLog);
    await service.recordFastingLog(fastingLog);
    expect(events.reduce((total, event) => total + event.points, 0)).toBe(200);
    await service.recordFastingLog({
      ...fastingLog,
      status: FastingStatus.NOT_FASTED,
    });
    expect(events.reduce((total, event) => total + event.points, 0)).toBe(0);

    events = [];
    const dhikrLog = {
      id: '66666666-6666-6666-6666-666666666666',
      userId: '22222222-2222-2222-2222-222222222222',
      dhikrDate: '2026-09-04',
      period: DhikrPeriod.MORNING,
      sessionType: DhikrSessionType.MORNING_ADHKAR,
      counter: 0,
      completed: true,
    };
    await service.recordDhikrLog(dhikrLog);
    await service.recordDhikrLog(dhikrLog);
    expect(events.reduce((total, event) => total + event.points, 0)).toBe(50);
    await service.recordDhikrLog({ ...dhikrLog, completed: false });
    expect(events.reduce((total, event) => total + event.points, 0)).toBe(0);
  });

  it('keeps one solidarity contribution and reverses it on deletion', async () => {
    const log = {
      id: '77777777-7777-7777-7777-777777777777',
      userId: '22222222-2222-2222-2222-222222222222',
      charityDate: '2026-09-04',
      currency: 'EUR',
      actionType: CharityActionType.MARAUDE,
    };

    await service.recordCharityLog(log);
    await service.recordCharityLog(log);
    expect(events).toHaveLength(1);
    expect(events.reduce((total, event) => total + event.points, 0)).toBe(300);
    await service.reverseEventsForLog(
      log.userId,
      HasanatSourceType.CHARITY,
      log.id,
      log.charityDate,
    );
    expect(events.reduce((total, event) => total + event.points, 0)).toBe(0);
  });
});
