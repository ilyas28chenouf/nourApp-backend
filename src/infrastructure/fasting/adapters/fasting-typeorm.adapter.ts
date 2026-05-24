import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FastingPersistencePort } from '../../../domain/fasting/ports/fasting-persistence.port';
import { FastingLogTypeormEntity } from '../entities/fasting-log.typeorm-entity';
import { FastingRecommendedDayTypeormEntity } from '../entities/fasting-recommended-day.typeorm-entity';
@Injectable() export class FastingTypeormAdapter implements FastingPersistencePort {
  private readonly logs: Repository<FastingLogTypeormEntity>; private readonly days: Repository<FastingRecommendedDayTypeormEntity>;
  constructor(dataSource: DataSource) { this.logs = dataSource.getRepository(FastingLogTypeormEntity); this.days = dataSource.getRepository(FastingRecommendedDayTypeormEntity); }
  async findRecommendedDays(month?: string) { const days = await this.days.find({ order: { date: 'ASC' } }); return month ? days.filter((d) => d.date.startsWith(month)) : days; }
  findLogsByUserId(userId: string) { return this.logs.find({ where: { userId }, order: { createdAt: 'DESC' } }) as any; } findLogById(id: string) { return this.logs.findOne({ where: { id } }) as any; } createLog(data: any) { return this.logs.save(this.logs.create(data) as any) as any; } async updateLog(id: string, data: any) { const existing = await this.logs.findOne({ where: { id } }); if (!existing) throw new NotFoundException('Fasting log not found'); return this.logs.save({ ...existing, ...data }); }
}
