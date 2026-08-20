import { NotificationType } from '../../../domain/notifications/enums/notification-type.enum';
import { FastingType } from '../../../domain/fasting/enums/fasting-type.enum';
import { NotificationsSchedulerService } from './notifications-scheduler.service';

describe('NotificationsSchedulerService v1.6 scheduling', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-08-20T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('reschedules the existing notification stream without duplicates', async () => {
    const created: Array<Record<string, any>> = [];
    const notifications = {
      deletePendingGeneratedForUser: jest.fn().mockResolvedValue(undefined),
      findActiveDeviceTokensByUser: jest
        .fn()
        .mockResolvedValue([{ token: 'device-token' }]),
      findScheduledByDedupeKey: jest.fn().mockResolvedValue(null),
      createScheduled: jest.fn((input) => {
        created.push(input);
        return input;
      }),
      findDailyReminderContentByCycleDay: jest.fn().mockResolvedValue({
        id: 'daily-1',
        type: 'VERSE',
        frenchText: 'Approved content',
        arabicText: 'محتوى',
        source: 'fixture',
      }),
    };
    const user = {
      id: 'user-1',
      timezone: 'UTC',
      latitude: 48.85,
      longitude: 2.35,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    };
    const users = { findById: jest.fn().mockResolvedValue(user) };
    const preferences = {
      findByUserId: jest.fn().mockResolvedValue({
        userId: user.id,
        prayerNotificationsEnabled: true,
        fastingNotificationsEnabled: true,
        dhikrNotificationsEnabled: true,
        quranNotificationsEnabled: true,
        activityNotificationsEnabled: true,
        dailyReminderEnabled: true,
      }),
    };
    const prayers = {
      getPrayerTimes: jest.fn((_userId: string, prayerDate: string) => ({
        id: `times-${prayerDate}`,
        userId: user.id,
        prayerDate,
        timezone: 'UTC',
        latitude: user.latitude,
        longitude: user.longitude,
        calculationMethod: 'UOIF',
        madhab: 'Shafi',
        fajr: '05:00',
        dhuhr: '13:00',
        asr: '17:00',
        maghrib: '20:00',
        isha: '22:00',
        source: 'fixture',
      })),
    };
    const fasting = {
      findRecommendedDays: jest.fn().mockResolvedValue([
        {
          id: 'fast-1',
          date: '2026-08-21',
          type: FastingType.MONDAY,
          title: 'Jeûne recommandé',
        },
      ]),
    };
    const scheduler = new NotificationsSchedulerService(
      notifications as never,
      {} as never,
      users as never,
      preferences as never,
      prayers as never,
      fasting as never,
      { get: jest.fn().mockReturnValue(undefined) } as never,
      { warn: jest.fn() } as never,
    );

    await scheduler.rescheduleUser(user.id);

    expect(notifications.deletePendingGeneratedForUser).toHaveBeenCalledWith(
      user.id,
    );
    expect(prayers.getPrayerTimes).toHaveBeenCalledTimes(2);
    expect(new Set(created.map((item) => item.dedupeKey)).size).toBe(
      created.length,
    );
    expect(created.map((item) => item.type)).toEqual(
      expect.arrayContaining([
        NotificationType.PRAYER,
        NotificationType.FASTING,
        NotificationType.DHIKR,
        NotificationType.QURAN,
        NotificationType.ACTIVITY,
        NotificationType.DAILY_VERSE,
      ]),
    );
    expect(created).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          dedupeKey: 'prayer:user-1:2026-08-20:FAJR:BEFORE',
          scheduledAt: new Date('2026-08-20T04:50:00.000Z'),
        }),
        expect.objectContaining({
          dedupeKey: 'dhikr:user-1:2026-08-20:FAJR',
          scheduledAt: new Date('2026-08-20T05:15:00.000Z'),
        }),
        expect.objectContaining({
          dedupeKey: 'fasting:user-1:2026-08-21:MONDAY',
          scheduledAt: new Date('2026-08-20T18:00:00.000Z'),
        }),
        expect.objectContaining({
          dedupeKey: 'activity:user-1:2026-09-01',
          scheduledAt: new Date('2026-09-01T09:00:00.000Z'),
        }),
      ]),
    );
    expect(created.some((item) => item.type === 'ENCOURAGEMENT')).toBe(false);
  });
});
