import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PrayerLogsPersistencePort } from '../../../domain/prayers/ports/prayer-logs-persistence.port';
import { PrayerLogTypeormEntity } from '../entities/prayer-log.typeorm-entity';

@Injectable()
export class PrayerLogsTypeormAdapter implements PrayerLogsPersistencePort {
  private readonly repository: Repository<PrayerLogTypeormEntity>;
  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(PrayerLogTypeormEntity);
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
  create(data: any) {
    return this.repository.save(this.repository.create(data) as any) as any;
  }
  async update(id: string, data: any) {
    const existing = await this.repository.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Prayer log not found');
    return this.repository.save({ ...existing, ...this.stripUndefined(data) });
  }

  private stripUndefined(data: Record<string, unknown>) {
    return Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    );
  }
}
