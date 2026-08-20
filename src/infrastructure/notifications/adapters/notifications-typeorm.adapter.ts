import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, LessThanOrEqual, Repository } from 'typeorm';
import { NotificationStatus } from '../../../domain/notifications/enums/notification-status.enum';
import { NotificationsPersistencePort } from '../../../domain/notifications/ports/notifications-persistence.port';
import { DailyReminderContentTypeormEntity } from '../entities/daily-reminder-content.typeorm-entity';
import { DeviceTokenTypeormEntity } from '../entities/device-token.typeorm-entity';
import { ScheduledNotificationTypeormEntity } from '../entities/scheduled-notification.typeorm-entity';
@Injectable()
export class NotificationsTypeormAdapter implements NotificationsPersistencePort {
  private readonly tokens: Repository<DeviceTokenTypeormEntity>;
  private readonly scheduled: Repository<ScheduledNotificationTypeormEntity>;
  private readonly dailyContents: Repository<DailyReminderContentTypeormEntity>;
  constructor(dataSource: DataSource) {
    this.tokens = dataSource.getRepository(DeviceTokenTypeormEntity);
    this.scheduled = dataSource.getRepository(
      ScheduledNotificationTypeormEntity,
    );
    this.dailyContents = dataSource.getRepository(
      DailyReminderContentTypeormEntity,
    );
  }
  findDeviceTokenByToken(token: string) {
    return this.tokens.findOne({ where: { token } }) as any;
  }
  createDeviceToken(data: any) {
    return this.tokens.save(this.tokens.create(data) as any) as any;
  }
  async updateDeviceToken(id: string, data: any) {
    const existing = await this.tokens.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Device token not found');
    return this.tokens.save({ ...existing, ...data });
  }
  findActiveDeviceTokensByUser(userId: string) {
    return this.tokens.find({
      where: { userId, isActive: true },
      order: { lastSeenAt: 'DESC' },
    }) as any;
  }
  async deactivateDeviceToken(id: string) {
    await this.tokens.update({ id }, { isActive: false });
  }
  findScheduled(userId: string, limit = 100) {
    return this.scheduled.find({
      where: { userId },
      order: { scheduledAt: 'DESC' },
      take: limit,
    });
  }
  createScheduled(data: any) {
    return this.scheduled.save(this.scheduled.create(data) as any) as any;
  }
  async updateScheduled(id: string, data: any) {
    const existing = await this.scheduled.findOne({ where: { id } });
    if (!existing)
      throw new NotFoundException('Scheduled notification not found');
    await this.scheduled.update({ id }, data);
    return (await this.scheduled.findOne({ where: { id } })) as any;
  }
  findDueScheduled(limit: number) {
    return this.scheduled.find({
      where: {
        status: NotificationStatus.PENDING,
        scheduledAt: LessThanOrEqual(new Date()),
      },
      order: { scheduledAt: 'ASC' },
      take: limit,
    }) as any;
  }
  findScheduledByDedupeKey(dedupeKey: string) {
    return this.scheduled.findOne({ where: { dedupeKey } }) as any;
  }
  updateScheduledStatus(
    id: string,
    status: NotificationStatus,
    data: any = {},
  ) {
    return this.updateScheduled(id, { ...data, status });
  }
  async deletePendingGeneratedForUser(userId: string) {
    await this.scheduled
      .createQueryBuilder()
      .delete()
      .where('"userId" = :userId', { userId })
      .andWhere('"status" = :status', { status: NotificationStatus.PENDING })
      .andWhere(
        '("dedupeKey" LIKE :prayer OR "dedupeKey" LIKE :fasting OR "dedupeKey" LIKE :dhikr OR "dedupeKey" LIKE :quran OR "dedupeKey" LIKE :activity OR "dedupeKey" LIKE :daily)',
        {
          prayer: 'prayer:%',
          fasting: 'fasting:%',
          dhikr: 'dhikr:%',
          quran: 'quran:%',
          activity: 'activity:%',
          daily: 'daily-reminder:%',
        },
      )
      .execute();
  }
  findDailyReminderContentByCycleDay(cycleDay: number) {
    return this.dailyContents.findOne({
      where: { cycleDay, isActive: true },
    });
  }
}
