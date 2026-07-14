import { ConflictException, NotFoundException } from '@nestjs/common';
import { HadithItemModel } from '../../domain/hadith/model/hadith-item.model';
import {
  HadithItemFilters,
  HadithPersistencePort,
} from '../../domain/hadith/ports/hadith-persistence.port';

export class ManageHadithItemsUsecase {
  constructor(private readonly persistence: HadithPersistencePort) {}

  async list(collectionId: string, filters: HadithItemFilters) {
    await this.requireCollection(collectionId);
    return this.persistence.listItems(collectionId, filters);
  }

  async get(id: string) {
    const item = await this.persistence.findItemById(id);
    if (!item) throw new NotFoundException('Hadith item not found');
    return item;
  }

  async create(collectionId: string, data: Partial<HadithItemModel>) {
    await this.requireCollection(collectionId);
    if (
      data.hadithNumber !== undefined &&
      (await this.persistence.findItemByNumber(collectionId, data.hadithNumber))
    ) {
      throw new ConflictException(
        'Hadith number already exists in this collection',
      );
    }
    return this.persistence.createItem({ ...data, collectionId });
  }

  async update(id: string, data: Partial<HadithItemModel>) {
    const existing = await this.get(id);
    if (
      data.hadithNumber !== undefined &&
      data.hadithNumber !== existing.hadithNumber &&
      (await this.persistence.findItemByNumber(
        existing.collectionId,
        data.hadithNumber,
      ))
    ) {
      throw new ConflictException(
        'Hadith number already exists in this collection',
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
    if (!collection) throw new NotFoundException('Hadith collection not found');
    return collection;
  }
}
