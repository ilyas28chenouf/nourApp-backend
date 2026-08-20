import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PrayerLogsPersistencePort } from '../../../domain/prayers/ports/prayer-logs-persistence.port';
import { PrayerLogTypeormEntity } from '../entities/prayer-log.typeorm-entity';
import { AdditionalPrayerLogTypeormEntity } from '../entities/additional-prayer-log.typeorm-entity';

@Injectable()
export class PrayerLogsTypeormAdapter implements PrayerLogsPersistencePort {
  private readonly repository: Repository<PrayerLogTypeormEntity>;
  private readonly additional: Repository<AdditionalPrayerLogTypeormEntity>;
  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(PrayerLogTypeormEntity);
    this.additional = dataSource.getRepository(
      AdditionalPrayerLogTypeormEntity,
    );
  }
  findByUserId(userId: string) {
    return this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    }) as any;
  }
  findById(id: string) {
    return this.repository.findOne({ where: { id } }) as any;
  }
  findAdditionalByUserId(userId: string) {
    return this.additional.find({
      where: { userId },
      order: { prayerDate: 'DESC', createdAt: 'DESC' },
    });
  }
  create(data: any) {
    return this.repository.save(this.repository.create(data) as any) as any;
  }
  async update(id: string, data: any) {
    const existing = await this.repository.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Prayer log not found');
    return this.repository.save({ ...existing, ...this.stripUndefined(data) });
  }
  async delete(id: string) {
    await this.repository.delete(id);
  }

  private stripUndefined(data: Record<string, unknown>) {
    return Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    );
  }
}
