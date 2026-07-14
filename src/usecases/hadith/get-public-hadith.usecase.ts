import { NotFoundException } from '@nestjs/common';
import {
  HadithCollectionFilters,
  HadithItemFilters,
  HadithPersistencePort,
} from '../../domain/hadith/ports/hadith-persistence.port';

export class GetPublicHadithUsecase {
  constructor(private readonly persistence: HadithPersistencePort) {}

  listCollections(filters: HadithCollectionFilters) {
    return this.persistence.listCollections(filters, true);
  }

  async getCollection(key: string) {
    const collection = await this.persistence.findCollectionByKey(key, true);
    if (!collection) throw new NotFoundException('Hadith collection not found');
    return collection;
  }

  async listItems(key: string, filters: HadithItemFilters) {
    const collection = await this.getCollection(key);
    const result = await this.persistence.listItems(
      collection.id,
      filters,
      true,
    );
    return { collection, result };
  }

  async getItem(key: string, hadithNumber: number) {
    const collection = await this.getCollection(key);
    const item = await this.persistence.findItemByNumber(
      collection.id,
      hadithNumber,
      true,
    );
    if (!item) throw new NotFoundException('Hadith item not found');
    return { collection, item };
  }
}
