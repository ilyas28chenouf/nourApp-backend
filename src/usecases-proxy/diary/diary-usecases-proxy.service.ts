import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DiaryEntryType } from '../../domain/diary/enums/diary-entry-type.enum';
import { DiaryEntryTypeormEntity } from '../../infrastructure/diary/entities/diary-entry.typeorm-entity';

@Injectable()
export class DiaryUsecasesProxyService {
  private readonly entries: Repository<DiaryEntryTypeormEntity>;

  constructor(dataSource: DataSource) {
    this.entries = dataSource.getRepository(DiaryEntryTypeormEntity);
  }

  list(userId: string, from?: string, to?: string, type?: DiaryEntryType) {
    const qb = this.entries
      .createQueryBuilder('entry')
      .where('entry.userId = :userId', { userId })
      .orderBy('entry.entryDate', 'DESC')
      .addOrderBy('entry.createdAt', 'DESC');

    if (from) qb.andWhere('entry.entryDate >= :from', { from });
    if (to) qb.andWhere('entry.entryDate <= :to', { to });
    if (type) qb.andWhere('entry.type = :type', { type });
    return qb.getMany();
  }

  create(userId: string, data: any) {
    return this.entries.save(
      this.entries.create({
        userId,
        ...data,
        entryDate: data.entryDate ?? new Date().toISOString().slice(0, 10),
        tags: data.tags ?? [],
      }),
    );
  }

  async get(userId: string, id: string) {
    const entry = await this.entries.findOne({ where: { id, userId } });
    if (!entry) throw new NotFoundException('Diary entry not found');
    return entry;
  }

  async update(userId: string, id: string, data: any) {
    const existing = await this.get(userId, id);
    return this.entries.save({ ...existing, ...this.stripUndefined(data) });
  }

  async delete(userId: string, id: string) {
    const existing = await this.get(userId, id);
    await this.entries.delete(existing.id);
    return { deleted: true };
  }

  async summary(userId: string, from: string, to: string) {
    const entries = await this.list(userId, from, to);
    const byType = {
      [DiaryEntryType.REFLEXION]: 0,
      [DiaryEntryType.NIYYAH]: 0,
      [DiaryEntryType.GRATITUDE]: 0,
    };
    const byFeeling: Record<string, number> = {};
    const tags = new Map<string, number>();

    for (const entry of entries) {
      byType[entry.type] += 1;
      const feeling = entry.feeling?.trim();
      if (feeling) byFeeling[feeling] = (byFeeling[feeling] ?? 0) + 1;
      for (const tag of entry.tags ?? []) {
        const key = tag.trim();
        if (key) tags.set(key, (tags.get(key) ?? 0) + 1);
      }
    }

    return {
      userId,
      from,
      to,
      total: entries.length,
      byType,
      byFeeling,
      topTags: Array.from(tags.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag)),
    };
  }

  private stripUndefined(data: Record<string, unknown>) {
    return Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    );
  }
}
