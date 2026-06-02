import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PrayerTimesPersistencePort } from '../../../domain/prayers/ports/prayer-times-persistence.port';
import { PrayerTimeTypeormEntity } from '../entities/prayer-time.typeorm-entity';

@Injectable()
export class PrayerTimesTypeormAdapter implements PrayerTimesPersistencePort {
  private readonly repository: Repository<PrayerTimeTypeormEntity>;
  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(PrayerTimeTypeormEntity);
  }
  findByUserAndDate(userId: string, prayerDate: string) {
    return this.repository.findOne({ where: { userId, prayerDate } }) as any;
  }
}
