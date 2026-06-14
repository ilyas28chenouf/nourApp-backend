import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { QuranPersistencePort } from '../../../domain/quran/ports/quran-persistence.port';
import { QuranReadingGoalTypeormEntity } from '../entities/quran-reading-goal.typeorm-entity';
import { QuranReadingLogTypeormEntity } from '../entities/quran-reading-log.typeorm-entity';
import { QuranMemorizationProgressTypeormEntity } from '../entities/quran-memorization-progress.typeorm-entity';
@Injectable()
export class QuranTypeormAdapter implements QuranPersistencePort {
  private readonly logs: Repository<QuranReadingLogTypeormEntity>;
  private readonly goals: Repository<QuranReadingGoalTypeormEntity>;
  private readonly memorization: Repository<QuranMemorizationProgressTypeormEntity>;
  constructor(dataSource: DataSource) {
    this.logs = dataSource.getRepository(QuranReadingLogTypeormEntity);
    this.goals = dataSource.getRepository(QuranReadingGoalTypeormEntity);
    this.memorization = dataSource.getRepository(
      QuranMemorizationProgressTypeormEntity,
    );
  }
  findLogsByUserId(userId: string) {
    return this.logs.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    }) as any;
  }
  findLogById(id: string) {
    return this.logs.findOne({ where: { id } }) as any;
  }
  createLog(data: any) {
    return this.logs.save(this.logs.create(data) as any) as any;
  }
  async updateLog(id: string, data: any) {
    const existing = await this.logs.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Quran log not found');
    return this.logs.save({ ...existing, ...this.stripUndefined(data) });
  }
  async deleteLog(id: string) {
    await this.logs.delete(id);
  }
  findGoalsByUserId(userId: string) {
    return this.goals.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }
  findGoalById(id: string) {
    return this.goals.findOne({ where: { id } });
  }
  createGoal(data: any) {
    return this.goals.save(this.goals.create(data) as any) as any;
  }
  async updateGoal(id: string, data: any) {
    const existing = await this.goals.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Quran goal not found');
    return this.goals.save({ ...existing, ...this.stripUndefined(data) });
  }
  async deleteGoal(id: string) {
    await this.goals.delete(id);
  }
  findMemorizationByUserId(userId: string) {
    return this.memorization.find({
      where: { userId },
      order: { surahNumber: 'ASC', createdAt: 'DESC' },
    });
  }
  createMemorization(data: any) {
    return this.memorization.save(this.memorization.create(data) as any);
  }
  async updateMemorization(id: string, data: any) {
    const existing = await this.memorization.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Quran memorization not found');
    return this.memorization.save({
      ...existing,
      ...this.stripUndefined(data),
    });
  }

  private stripUndefined(data: Record<string, unknown>) {
    return Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    );
  }
}
