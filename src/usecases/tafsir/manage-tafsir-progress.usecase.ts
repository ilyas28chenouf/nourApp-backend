import { NotFoundException } from '@nestjs/common';
import {
  requireDateOnly,
  todayDateOnly,
} from '../../common-utils/dates/date-format.util';
import { TafsirPersistencePort } from '../../domain/tafsir/ports/tafsir-persistence.port';

export class ManageTafsirProgressUsecase {
  constructor(private readonly persistence: TafsirPersistencePort) {}

  async list(userId: string, from?: string, to?: string) {
    const progress = await this.persistence.findProgressByUserId(userId);
    return progress.filter(
      (item) =>
        (!from || item.readDate >= from) && (!to || item.readDate <= to),
    );
  }

  async create(userId: string, data: Record<string, any>) {
    const item = await this.persistence.findItemByLocation(
      data.collectionId,
      data.surahNumber,
      data.ayahNumber,
      true,
    );
    if (!item) throw new NotFoundException('Active Tafsir item not found');
    return this.persistence.createProgress({
      ...data,
      userId,
      readDate: requireDateOnly(data.readDate ?? todayDateOnly(), 'readDate'),
      completed: data.completed ?? true,
    });
  }

  async update(userId: string, id: string, data: Record<string, any>) {
    const existing = await this.persistence.findProgressById(id);
    if (!existing || existing.userId !== userId) {
      throw new NotFoundException('Tafsir progress not found');
    }
    return this.persistence.updateProgress(id, {
      ...data,
      readDate:
        data.readDate === undefined
          ? undefined
          : requireDateOnly(data.readDate, 'readDate'),
    });
  }
}
