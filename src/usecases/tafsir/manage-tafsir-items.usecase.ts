import { ConflictException, NotFoundException } from '@nestjs/common';
import { TafsirItemModel } from '../../domain/tafsir/model/tafsir-item.model';
import {
  TafsirItemFilters,
  TafsirPersistencePort,
} from '../../domain/tafsir/ports/tafsir-persistence.port';

export class ManageTafsirItemsUsecase {
  constructor(private readonly persistence: TafsirPersistencePort) {}

  async list(collectionId: string, filters: TafsirItemFilters) {
    await this.requireCollection(collectionId);
    return this.persistence.listItems(collectionId, filters);
  }

  async get(id: string) {
    const item = await this.persistence.findItemById(id);
    if (!item) throw new NotFoundException('Tafsir item not found');
    return item;
  }

  async create(collectionId: string, data: Partial<TafsirItemModel>) {
    await this.requireCollection(collectionId);
    if (
      data.surahNumber !== undefined &&
      data.ayahNumber !== undefined &&
      (await this.persistence.findItemByLocation(
        collectionId,
        data.surahNumber,
        data.ayahNumber,
      ))
    ) {
      throw new ConflictException(
        'Tafsir entry already exists for this collection, surah and ayah',
      );
    }
    return this.persistence.createItem({ ...data, collectionId });
  }

  async update(id: string, data: Partial<TafsirItemModel>) {
    const existing = await this.get(id);
    const surahNumber = data.surahNumber ?? existing.surahNumber;
    const ayahNumber = data.ayahNumber ?? existing.ayahNumber;
    if (
      (surahNumber !== existing.surahNumber ||
        ayahNumber !== existing.ayahNumber) &&
      (await this.persistence.findItemByLocation(
        existing.collectionId,
        surahNumber,
        ayahNumber,
      ))
    ) {
      throw new ConflictException(
        'Tafsir entry already exists for this collection, surah and ayah',
      );
    }
    return this.persistence.updateItem(id, data);
  }

  async delete(id: string) {
    await this.get(id);
    await this.persistence.deleteItem(id);
    return { deleted: true };
  }

  private async requireCollection(collectionId: string) {
    const collection = await this.persistence.findCollectionById(collectionId);
    if (!collection) throw new NotFoundException('Tafsir collection not found');
    return collection;
  }
}
