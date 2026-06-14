import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { WomenPeriodLogTypeormEntity } from '../../infrastructure/women/entities/women-period-log.typeorm-entity';

const BOOLEAN_FIELDS = [
  'quran',
  'dhikr',
  'doua',
  'reading',
  'sadaka',
  'meditation',
  'hadith',
  'health',
] as const;

@Injectable()
export class WomenUsecasesProxyService {
  private readonly logs: Repository<WomenPeriodLogTypeormEntity>;

  constructor(dataSource: DataSource) {
    this.logs = dataSource.getRepository(WomenPeriodLogTypeormEntity);
  }

  list(userId: string, from?: string, to?: string) {
    const qb = this.logs
      .createQueryBuilder('log')
      .where('log.userId = :userId', { userId })
      .orderBy('log.date', 'DESC')
      .addOrderBy('log.createdAt', 'DESC');

    if (from) qb.andWhere('log.date >= :from', { from });
    if (to) qb.andWhere('log.date <= :to', { to });
    return qb.getMany();
  }

  create(userId: string, data: any) {
    return this.logs.save(
      this.logs.create({
        userId,
        ...this.withBooleanDefaults(data),
      }),
    );
  }

  async get(userId: string, id: string) {
    const log = await this.logs.findOne({ where: { id, userId } });
    if (!log) throw new NotFoundException('Women period log not found');
    return log;
  }

  async update(userId: string, id: string, data: any) {
    const existing = await this.get(userId, id);
    return this.logs.save({ ...existing, ...this.stripUndefined(data) });
  }

  async delete(userId: string, id: string) {
    const existing = await this.get(userId, id);
    await this.logs.delete(existing.id);
    return { deleted: true };
  }

  async summary(userId: string, from: string, to: string) {
    const logs = await this.list(userId, from, to);
    const totals = Object.fromEntries(
      BOOLEAN_FIELDS.map((field) => [
        field,
        logs.filter((log) => Boolean(log[field])).length,
      ]),
    );

    return {
      userId,
      from,
      to,
      totalDays: logs.length,
      totals,
    };
  }

  private withBooleanDefaults(data: any) {
    return {
      ...data,
      ...Object.fromEntries(
        BOOLEAN_FIELDS.map((field) => [field, Boolean(data?.[field])]),
      ),
    };
  }

  private stripUndefined(data: Record<string, unknown>) {
    return Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    );
  }
}
