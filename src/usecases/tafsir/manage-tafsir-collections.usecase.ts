import { ConflictException, NotFoundException } from '@nestjs/common';
import { TafsirCollectionModel } from '../../domain/tafsir/model/tafsir-collection.model';
import {
  TafsirCollectionFilters,
  TafsirPersistencePort,
} from '../../domain/tafsir/ports/tafsir-persistence.port';

export class ManageTafsirCollectionsUsecase {
  constructor(private readonly persistence: TafsirPersistencePort) {}

  list(filters: TafsirCollectionFilters) {
    return this.persistence.listCollections(filters);
  }

  async get(id: string) {
    const collection = await this.persistence.findCollectionById(id);
    if (!collection) throw new NotFoundException('Tafsir collection not found');
    return collection;
  }

  async create(data: Partial<TafsirCollectionModel>) {
    const key = data.key?.toLowerCase();
    if (key && (await this.persistence.findCollectionByKey(key))) {
      throw new ConflictException('Tafsir collection key already exists');
    }
    return this.persistence.createCollection({
      ...data,
      key,
      published: data.published ?? true,
    });
  }

  async update(id: string, data: Partial<TafsirCollectionModel>) {
    const existing = await this.get(id);
    const key = data.key?.toLowerCase();
    if (key && key !== existing.key) {
      const duplicate = await this.persistence.findCollectionByKey(key);
      if (duplicate) {
        throw new ConflictException('Tafsir collection key already exists');
      }
    }
    const { published, ...changes } = data;
    return this.persistence.updateCollection(id, {
      ...changes,
      ...(key ? { key } : {}),
      ...(published !== undefined ? { published } : {}),
    });
  }

  async delete(id: string) {
    await this.get(id);
    if ((await this.persistence.countItems(id)) > 0) {
      throw new ConflictException(
        'Cannot delete a Tafsir collection that contains items. Deactivate it or delete its items first.',
      );
    }
    await this.persistence.deleteCollection(id);
    return { deleted: true };
  }
}
