import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PrayerTimeModel } from '../../../domain/prayers/model/prayer-time.model';
import { PrayerTimesPersistencePort } from '../../../domain/prayers/ports/prayer-times-persistence.port';
import { PrayerTimeTypeormEntity } from '../entities/prayer-time.typeorm-entity';

@Injectable()
export class PrayerTimesTypeormAdapter implements PrayerTimesPersistencePort {
  private readonly repository: Repository<PrayerTimeTypeormEntity>;
  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(PrayerTimeTypeormEntity);
  }
  findCached(
    userId: string,
    prayerDate: string,
    calculationMethod: string,
    madhab: string,
    timezone: string,
  ) {
    return this.repository.findOne({
      where: { userId, prayerDate, calculationMethod, madhab, timezone },
    }) as Promise<PrayerTimeModel | null>;
  }

  create(data: Partial<PrayerTimeModel>) {
    return this.repository.save(
      this.repository.create(data as any) as any,
    ) as any as Promise<PrayerTimeModel>;
  }
}
