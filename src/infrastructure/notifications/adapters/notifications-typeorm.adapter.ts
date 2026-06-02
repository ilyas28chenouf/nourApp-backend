import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { NotificationsPersistencePort } from '../../../domain/notifications/ports/notifications-persistence.port';
import { DeviceTokenTypeormEntity } from '../entities/device-token.typeorm-entity';
import { ScheduledNotificationTypeormEntity } from '../entities/scheduled-notification.typeorm-entity';
@Injectable()
export class NotificationsTypeormAdapter implements NotificationsPersistencePort {
  private readonly tokens: Repository<DeviceTokenTypeormEntity>;
  private readonly scheduled: Repository<ScheduledNotificationTypeormEntity>;
  constructor(dataSource: DataSource) {
    this.tokens = dataSource.getRepository(DeviceTokenTypeormEntity);
    this.scheduled = dataSource.getRepository(
      ScheduledNotificationTypeormEntity,
    );
  }
  findDeviceToken(userId: string, token: string) {
    return this.tokens.findOne({ where: { userId, token } }) as any;
  }
  createDeviceToken(data: any) {
    return this.tokens.save(this.tokens.create(data) as any) as any;
  }
  async updateDeviceToken(id: string, data: any) {
    const existing = await this.tokens.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Device token not found');
    return this.tokens.save({ ...existing, ...data });
  }
  findScheduled(userId: string) {
    return this.scheduled.find({
      where: { userId },
      order: { scheduledAt: 'ASC' },
    });
  }
  createScheduled(data: any) {
    return this.scheduled.save(this.scheduled.create(data) as any) as any;
  }
}
