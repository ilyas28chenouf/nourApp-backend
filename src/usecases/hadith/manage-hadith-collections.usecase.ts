import { ConflictException, NotFoundException } from '@nestjs/common';
import { HadithCollectionModel } from '../../domain/hadith/model/hadith-collection.model';
import {
  HadithCollectionFilters,
  HadithPersistencePort,
} from '../../domain/hadith/ports/hadith-persistence.port';

export class ManageHadithCollectionsUsecase {
  constructor(private readonly persistence: HadithPersistencePort) {}

  list(filters: HadithCollectionFilters) {
    return this.persistence.listCollections(filters);
  }

  async get(id: string) {
    const collection = await this.persistence.findCollectionById(id);
    if (!collection) throw new NotFoundException('Hadith collection not found');
    return collection;
  }

  async create(data: Partial<HadithCollectionModel>) {
    const key = data.key?.toLowerCase();
    if (key && (await this.persistence.findCollectionByKey(key))) {
      throw new ConflictException('Hadith collection key already exists');
    }
    return this.persistence.createCollection({ ...data, key });
  }

  async update(id: string, data: Partial<HadithCollectionModel>) {
    const existing = await this.get(id);
    const key = data.key?.toLowerCase();
    if (key && key !== existing.key) {
      const duplicate = await this.persistence.findCollectionByKey(key);
      if (duplicate) {
        throw new ConflictException('Hadith collection key already exists');
      }
    }
    return this.persistence.updateCollection(id, {
      ...data,
      ...(key ? { key } : {}),
    });
  }

  async delete(id: string) {
    await this.get(id);
    if ((await this.persistence.countItems(id)) > 0) {
      throw new ConflictException(
        'Cannot delete a Hadith collection that contains items. Deactivate it or delete its items first.',
      );
    }
    await this.persistence.deleteCollection(id);
    return { deleted: true };
  }
}
