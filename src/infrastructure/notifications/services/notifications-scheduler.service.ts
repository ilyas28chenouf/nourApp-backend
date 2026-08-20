import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import { NotificationStatus } from '../../../domain/notifications/enums/notification-status.enum';
import { NotificationType } from '../../../domain/notifications/enums/notification-type.enum';
import { PrayerTimeModel } from '../../../domain/prayers/model/prayer-time.model';
import { UserModel } from '../../../domain/users/model/user.model';
import { UserPreferenceModel } from '../../../domain/users/model/user-preference.model';
import { PrayersUsecasesProxyService } from '../../../usecases-proxy/prayers/prayers-usecases-proxy.service';
import { FastingTypeormAdapter } from '../../fasting/adapters/fasting-typeorm.adapter';
import { AppLoggerService } from '../../logger/app-logger.service';
import { UserPreferencesTypeormAdapter } from '../../users/adapters/user-preferences-typeorm.adapter';
import { UsersTypeormAdapter } from '../../users/adapters/users-typeorm.adapter';
import { NotificationsTypeormAdapter } from '../adapters/notifications-typeorm.adapter';
import {
  ACTIVITY_REMINDER_LOCAL_TIME,
  DEFAULT_AFTER_PRAYER_DELAY_MINUTES,
  FASTING_REMINDER_LOCAL_TIME,
  PRAYER_REMINDER_LEAD_MINUTES,
} from '../constants/notification-schedule.constants';
import { NotificationsFcmService } from './notifications-fcm.service';

@Injectable()
export class NotificationsSchedulerService {
  private isProcessingPending = false;
  private isScheduling = false;
  private readonly afterPrayerDelayMinutes: number;

  constructor(
    private readonly notifications: NotificationsTypeormAdapter,
    private readonly fcm: NotificationsFcmService,
    private readonly users: UsersTypeormAdapter,
    private readonly preferences: UserPreferencesTypeormAdapter,
    private readonly prayers: PrayersUsecasesProxyService,
    private readonly fasting: FastingTypeormAdapter,
    private readonly config: ConfigService,
    private readonly logger: AppLoggerService,
  ) {
    const configured = Number(
      this.config.get<string>('NOTIFICATION_AFTER_PRAYER_DELAY_MINUTES'),
    );
    this.afterPrayerDelayMinutes =
      Number.isFinite(configured) && configured >= 0
        ? configured
        : DEFAULT_AFTER_PRAYER_DELAY_MINUTES;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async processPendingNotifications() {
    if (this.isProcessingPending) return;
    this.isProcessingPending = true;
    try {
      const dueNotifications = await this.notifications.findDueScheduled(100);
      for (const notification of dueNotifications) {
        const tokens = await this.notifications.findActiveDeviceTokensByUser(
          notification.userId,
        );
        if (tokens.length === 0) {
          await this.notifications.updateScheduledStatus(
            notification.id,
            NotificationStatus.FAILED,
            {
              failureReason: 'No active device token registered for this user',
            },
          );
          continue;
        }

        const result = await this.fcm.sendToTokens(tokens, {
          title: notification.title,
          body: notification.body,
          type: notification.type,
          scheduledNotificationId: notification.id,
          contentId: notification.contentId ?? undefined,
          screen:
            (notification.metadata?.screen as string | undefined) ?? 'home',
          data: this.metadataToFcmData(notification.metadata),
        });

        await this.notifications.updateScheduledStatus(
          notification.id,
          result.successCount > 0
            ? NotificationStatus.SENT
            : NotificationStatus.FAILED,
          result.successCount > 0
            ? { sentAt: new Date(), fcmMessageId: result.messageIds[0] }
            : {
                failureReason: result.errors.join(', ') || 'FCM send failed',
              },
        );
      }
    } finally {
      this.isProcessingPending = false;
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async scheduleUpcomingNotifications() {
    if (this.isScheduling) return;
    this.isScheduling = true;
    try {
      const users = await this.users.findAll();
      for (const user of users) {
        await this.scheduleForUserSafely(user);
      }
    } finally {
      this.isScheduling = false;
    }
  }

  async rescheduleUser(userId: string) {
    const user = await this.users.findById(userId);
    if (!user) return;
    await this.notifications.deletePendingGeneratedForUser(userId);
    await this.scheduleForUserSafely(user);
  }

  private async scheduleForUserSafely(user: UserModel) {
    try {
      await this.scheduleForUser(user);
    } catch (error) {
      this.logger.warn('Unable to schedule notifications for user', {
        userId: user.id,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private async scheduleForUser(user: UserModel) {
    const tokens = await this.notifications.findActiveDeviceTokensByUser(
      user.id,
    );
    if (tokens.length === 0) return;

    const preference = await this.getOrCreatePreferences(user.id);
    const timezone = user.timezone || 'Africa/Algiers';
    const localNow = DateTime.now().setZone(timezone);
    if (!localNow.isValid) return;

    await Promise.all([
      this.schedulePrayerDependent(user, preference, localNow),
      this.scheduleFasting(user, preference, localNow),
      this.scheduleActivity(user, preference, localNow),
    ]);
  }

  private async schedulePrayerDependent(
    user: UserModel,
    preference: UserPreferenceModel,
    localNow: DateTime,
  ) {
    if (!user.latitude || !user.longitude || !user.timezone) return;
    for (let offset = 0; offset <= 1; offset += 1) {
      const localDate = localNow.plus({ days: offset }).toISODate()!;
      const times = await this.prayers.getPrayerTimes(user.id, localDate);
      await this.schedulePrayerNotifications(user, preference, times, localNow);
      await this.scheduleAfterPrayerNotifications(
        user,
        preference,
        times,
        localNow,
      );
    }
  }

  private async schedulePrayerNotifications(
    user: UserModel,
    preference: UserPreferenceModel,
    times: PrayerTimeModel,
    localNow: DateTime,
  ) {
    if (preference.prayerNotificationsEnabled === false) return;
    const prayers = [
      ['FAJR', 'fajr'],
      ['DHUHR', 'dhuhr'],
      ['ASR', 'asr'],
      ['MAGHRIB', 'maghrib'],
      ['ISHA', 'isha'],
    ] as const;
    for (const [name, key] of prayers) {
      const at = this.prayerDateTime(times, key);
      if (!at) continue;
      await this.createIfFuture(localNow, {
        userId: user.id,
        type: NotificationType.PRAYER,
        title: `Prière de ${name}`,
        body: `La prière de ${name} commence dans ${PRAYER_REMINDER_LEAD_MINUTES} minutes.`,
        scheduledAt: at.minus({ minutes: PRAYER_REMINDER_LEAD_MINUTES }),
        dedupeKey: `prayer:${user.id}:${times.prayerDate}:${name}:BEFORE`,
        metadata: { screen: 'prayers', prayerName: name, timing: 'BEFORE' },
      });
      await this.createIfFuture(localNow, {
        userId: user.id,
        type: NotificationType.PRAYER,
        title: `Prière de ${name}`,
        body: `C’est l’heure de la prière de ${name}.`,
        scheduledAt: at,
        dedupeKey: `prayer:${user.id}:${times.prayerDate}:${name}:AT`,
        metadata: { screen: 'prayers', prayerName: name, timing: 'AT' },
      });
    }
  }

  private async scheduleAfterPrayerNotifications(
    user: UserModel,
    preference: UserPreferenceModel,
    times: PrayerTimeModel,
    localNow: DateTime,
  ) {
    const fajr = this.prayerDateTime(times, 'fajr');
    const asr = this.prayerDateTime(times, 'asr');
    for (const [prayerName, prayerTime] of [
      ['FAJR', fajr],
      ['ASR', asr],
    ] as const) {
      if (!prayerTime) continue;
      const scheduledAt = prayerTime.plus({
        minutes: this.afterPrayerDelayMinutes,
      });
      if (preference.dhikrNotificationsEnabled !== false) {
        await this.createIfFuture(localNow, {
          userId: user.id,
          type: NotificationType.DHIKR,
          title: 'Rappel de Dhikr',
          body: `Prenez un moment pour vos adhkar après ${prayerName}.`,
          scheduledAt,
          dedupeKey: `dhikr:${user.id}:${times.prayerDate}:${prayerName}`,
          metadata: { screen: 'dhikr', afterPrayer: prayerName },
        });
      }
      if (preference.quranNotificationsEnabled !== false) {
        await this.createIfFuture(localNow, {
          userId: user.id,
          type: NotificationType.QURAN,
          title: 'Lecture du Coran',
          body: `Votre temps de lecture après ${prayerName}.`,
          scheduledAt,
          dedupeKey: `quran:${user.id}:${times.prayerDate}:${prayerName}`,
          metadata: { screen: 'quran', afterPrayer: prayerName },
        });
      }
      if (prayerName === 'FAJR' && preference.dailyReminderEnabled !== false) {
        await this.scheduleDailyReminder(
          user,
          preference,
          times.prayerDate,
          scheduledAt,
          localNow,
        );
      }
    }
  }

  private async scheduleDailyReminder(
    user: UserModel,
    preference: UserPreferenceModel,
    localDate: string,
    scheduledAt: DateTime,
    localNow: DateTime,
  ) {
    const cycleDay = this.getCycleDay(
      user,
      preference,
      DateTime.fromISO(localDate, { zone: scheduledAt.zone }),
    );
    const content =
      await this.notifications.findDailyReminderContentByCycleDay(cycleDay);
    if (!content) return;
    const type =
      content.type === 'VERSE'
        ? NotificationType.DAILY_VERSE
        : NotificationType.DAILY_HADITH;
    await this.createIfFuture(localNow, {
      userId: user.id,
      type,
      title: content.type === 'VERSE' ? 'Verset du jour' : 'Hadith du jour',
      body: content.frenchText,
      scheduledAt,
      contentId: content.id,
      dedupeKey: `daily-reminder:${user.id}:${localDate}`,
      metadata: {
        cycleDay,
        localDate,
        source: content.source,
        arabicText: content.arabicText,
        screen: 'home',
      },
    });
  }

  private async scheduleFasting(
    user: UserModel,
    preference: UserPreferenceModel,
    localNow: DateTime,
  ) {
    if (preference.fastingNotificationsEnabled === false) return;
    const horizon = localNow.plus({ days: 2 }).endOf('day');
    const days = await this.fasting.findRecommendedDays();
    for (const day of days) {
      const fastDate = DateTime.fromISO(day.date, { zone: localNow.zone });
      const scheduledAt = fastDate
        .minus({ days: 1 })
        .set(FASTING_REMINDER_LOCAL_TIME);
      if (scheduledAt > horizon) continue;
      await this.createIfFuture(localNow, {
        userId: user.id,
        type: NotificationType.FASTING,
        title: 'Jeûne recommandé demain',
        body: day.title,
        scheduledAt,
        dedupeKey: `fasting:${user.id}:${day.date}:${day.type}`,
        metadata: {
          screen: 'fasting',
          fastingDate: day.date,
          fastingType: day.type,
        },
      });
    }
  }

  private async scheduleActivity(
    user: UserModel,
    preference: UserPreferenceModel,
    localNow: DateTime,
  ) {
    if (preference.activityNotificationsEnabled === false) return;
    const horizon = localNow.plus({ days: 32 }).endOf('day');
    let cursor = localNow.startOf('day');
    while (cursor <= horizon) {
      if (cursor.day === 1 || cursor.day === 15) {
        const scheduledAt = cursor.set(ACTIVITY_REMINDER_LOCAL_TIME);
        await this.createIfFuture(localNow, {
          userId: user.id,
          type: NotificationType.ACTIVITY,
          title: 'Engagement solidaire',
          body: 'Choisissez une activité solidaire pour cette quinzaine.',
          scheduledAt,
          dedupeKey: `activity:${user.id}:${cursor.toISODate()}`,
          metadata: { screen: 'activities' },
        });
      }
      cursor = cursor.plus({ days: 1 });
    }
  }

  private async createIfFuture(
    now: DateTime,
    input: {
      userId: string;
      type: NotificationType;
      title: string;
      body: string;
      scheduledAt: DateTime;
      dedupeKey: string;
      contentId?: string;
      metadata: Record<string, unknown>;
    },
  ) {
    if (!input.scheduledAt.isValid || input.scheduledAt <= now) return;
    if (await this.notifications.findScheduledByDedupeKey(input.dedupeKey)) {
      return;
    }
    await this.notifications.createScheduled({
      ...input,
      scheduledAt: input.scheduledAt.toUTC().toJSDate(),
      status: NotificationStatus.PENDING,
    });
  }

  private prayerDateTime(
    times: PrayerTimeModel,
    key: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha',
  ) {
    const dateTimeValue = times[`${key}DateTime`];
    if (dateTimeValue) {
      const parsed = DateTime.fromISO(dateTimeValue, { setZone: true });
      if (parsed.isValid) return parsed;
    }
    const timeValue = times[key];
    if (!timeValue) return null;
    const parsed = DateTime.fromISO(`${times.prayerDate}T${timeValue}`, {
      zone: times.timezone,
    });
    return parsed.isValid ? parsed : null;
  }

  private async getOrCreatePreferences(userId: string) {
    return (
      (await this.preferences.findByUserId(userId)) ??
      this.preferences.create({
        userId,
        language: 'fr',
        prayerCalculationMethod: 'Algeria',
        prayerMadhab: 'Shafi',
        dailyReminderEnabled: true,
        dailyReminderTime: '09:00',
      })
    );
  }

  private getCycleDay(
    user: UserModel,
    preference: UserPreferenceModel,
    localDate: DateTime,
  ) {
    const startDate =
      preference.dailyReminderCycleStartDate ??
      user.createdAt?.toISOString().slice(0, 10) ??
      localDate.toISODate();
    const start = DateTime.fromISO(startDate!, {
      zone: localDate.zone,
    }).startOf('day');
    const daysSinceStart = Math.max(
      0,
      Math.floor(localDate.startOf('day').diff(start, 'days').days),
    );
    return (daysSinceStart % 120) + 1;
  }

  private metadataToFcmData(metadata?: Record<string, unknown> | null) {
    if (!metadata) return undefined;
    return Object.fromEntries(
      Object.entries(metadata).filter(([, value]) =>
        ['string', 'number', 'boolean'].includes(typeof value),
      ),
    ) as Record<string, string | number | boolean>;
  }
}
