import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import { NotificationStatus } from '../../../domain/notifications/enums/notification-status.enum';
import { NotificationType } from '../../../domain/notifications/enums/notification-type.enum';
import { UserModel } from '../../../domain/users/model/user.model';
import { UserPreferenceModel } from '../../../domain/users/model/user-preference.model';
import { UserPreferencesTypeormAdapter } from '../../users/adapters/user-preferences-typeorm.adapter';
import { UsersTypeormAdapter } from '../../users/adapters/users-typeorm.adapter';
import { NotificationsTypeormAdapter } from '../adapters/notifications-typeorm.adapter';
import { NotificationsFcmService } from './notifications-fcm.service';

@Injectable()
export class NotificationsSchedulerService {
  private isProcessingPending = false;
  private isProcessingDailyReminders = false;

  constructor(
    private readonly notifications: NotificationsTypeormAdapter,
    private readonly fcm: NotificationsFcmService,
    private readonly users: UsersTypeormAdapter,
    private readonly preferences: UserPreferencesTypeormAdapter,
  ) {}

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
            ? {
                sentAt: new Date(),
                fcmMessageId: result.messageIds[0],
              }
            : {
                failureReason: result.errors.join(', ') || 'FCM send failed',
              },
        );
      }
    } finally {
      this.isProcessingPending = false;
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async processDailyReminders() {
    if (this.isProcessingDailyReminders) return;
    this.isProcessingDailyReminders = true;
    try {
      const users = await this.users.findAll();
      for (const user of users) {
        await this.processDailyReminderForUser(user);
      }
    } finally {
      this.isProcessingDailyReminders = false;
    }
  }

  private async processDailyReminderForUser(user: UserModel) {
    const tokens = await this.notifications.findActiveDeviceTokensByUser(
      user.id,
    );
    if (tokens.length === 0) return;

    const preference = await this.getOrCreatePreferences(user.id);
    if (
      preference.dailyReminderEnabled === false ||
      preference.quranNotificationsEnabled === false
    ) {
      return;
    }

    const timezone = user.timezone || 'Africa/Algiers';
    const localNow = DateTime.now().setZone(timezone);
    if (!localNow.isValid) return;

    const reminderTime = preference.dailyReminderTime || '09:00';
    if (localNow.toFormat('HH:mm') !== reminderTime) return;

    const localDate = localNow.toISODate();
    if (!localDate) return;

    const dedupeKey = `daily-reminder:${user.id}:${localDate}`;
    if (await this.notifications.findScheduledByDedupeKey(dedupeKey)) return;

    const cycleDay = this.getCycleDay(user, preference, localNow);
    const content =
      await this.notifications.findDailyReminderContentByCycleDay(cycleDay);
    if (!content) return;

    const type =
      content.type === 'VERSE'
        ? NotificationType.DAILY_VERSE
        : NotificationType.DAILY_HADITH;
    const notification = await this.notifications.createScheduled({
      userId: user.id,
      type,
      title: content.type === 'VERSE' ? 'Verset du jour' : 'Hadith du jour',
      body: content.frenchText,
      scheduledAt: new Date(),
      status: NotificationStatus.PENDING,
      contentId: content.id,
      dedupeKey,
      metadata: {
        cycleDay,
        localDate,
        source: content.source,
        arabicText: content.arabicText,
        screen: 'home',
      },
    });

    const result = await this.fcm.sendToTokens(tokens, {
      title: notification.title,
      body: notification.body,
      type: notification.type,
      scheduledNotificationId: notification.id,
      contentId: content.id,
      screen: 'home',
      data: {
        cycleDay,
        localDate,
        source: content.source,
      },
    });

    await this.notifications.updateScheduledStatus(
      notification.id,
      result.successCount > 0
        ? NotificationStatus.SENT
        : NotificationStatus.FAILED,
      result.successCount > 0
        ? {
            sentAt: new Date(),
            fcmMessageId: result.messageIds[0],
          }
        : {
            failureReason: result.errors.join(', ') || 'FCM send failed',
          },
    );
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
    localNow: DateTime,
  ) {
    const startDate =
      preference.dailyReminderCycleStartDate ??
      user.createdAt?.toISOString().slice(0, 10) ??
      localNow.toISODate();
    const start = DateTime.fromISO(startDate ?? localNow.toISODate()!, {
      zone: localNow.zone,
    }).startOf('day');
    const daysSinceStart = Math.max(
      0,
      Math.floor(localNow.startOf('day').diff(start, 'days').days),
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
