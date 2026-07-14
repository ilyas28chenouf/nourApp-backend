import { NotFoundException } from '@nestjs/common';
import {
  TafsirCollectionFilters,
  TafsirItemFilters,
  TafsirPersistencePort,
} from '../../domain/tafsir/ports/tafsir-persistence.port';

export class GetPublicTafsirUsecase {
  constructor(private readonly persistence: TafsirPersistencePort) {}

  listCollections(filters: TafsirCollectionFilters) {
    return this.persistence.listCollections(filters, true);
  }

  async getCollection(key: string) {
    const collection = await this.persistence.findCollectionByKey(key, true);
    if (!collection) throw new NotFoundException('Tafsir collection not found');
    return collection;
  }

  async listItems(key: string, filters: TafsirItemFilters) {
    const collection = await this.getCollection(key);
    const result = await this.persistence.listItems(
      collection.id,
      filters,
      true,
    );
    return { collection, result };
  }

  async getItem(key: string, surahNumber: number, ayahNumber: number) {
    const collection = await this.getCollection(key);
    const item = await this.persistence.findItemByLocation(
      collection.id,
      surahNumber,
      ayahNumber,
      true,
    );
    if (!item) throw new NotFoundException('Tafsir item not found');
    return { collection, item };
  }
}
