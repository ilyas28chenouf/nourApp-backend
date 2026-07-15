import { ConflictException } from '@nestjs/common';
import { HadithCollectionModel } from '../../domain/hadith/model/hadith-collection.model';
import { HadithItemModel } from '../../domain/hadith/model/hadith-item.model';
import {
  HadithCollectionFilters,
  HadithItemFilters,
  HadithPersistencePort,
} from '../../domain/hadith/ports/hadith-persistence.port';
import { HadithResponseMapper } from '../../interface-adapters/hadith/mappers/hadith.response.mapper';
import { GetPublicHadithUsecase } from './get-public-hadith.usecase';
import { ManageHadithCollectionsUsecase } from './manage-hadith-collections.usecase';
import { ManageHadithItemsUsecase } from './manage-hadith-items.usecase';

class InMemoryHadithPersistence implements HadithPersistencePort {
  collections: HadithCollectionModel[] = [];
  items: HadithItemModel[] = [];
  private sequence = 0;

  async listCollections(filters: HadithCollectionFilters, activeOnly = false) {
    await Promise.resolve();
    let collections = this.collections.filter(
      (collection) => !activeOnly || collection.isActive,
    );
    if (!activeOnly && filters.isActive !== undefined) {
      collections = collections.filter(
        (collection) => collection.isActive === filters.isActive,
      );
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      collections = collections.filter((collection) =>
        [
          collection.key,
          collection.name,
          collection.arabicName,
          collection.author,
        ].some((value) => value.toLowerCase().includes(search)),
      );
    }
    const total = collections.length;
    const start = (filters.page - 1) * filters.limit;
    const paged = collections
      .slice(start, start + filters.limit)
      .map((collection) => ({
        ...collection,
        totalHadiths: this.items.filter(
          (item) =>
            item.collectionId === collection.id &&
            (!activeOnly || item.isActive),
        ).length,
      }));
    return {
      items: paged,
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: Math.ceil(total / filters.limit),
    };
  }

  async findCollectionById(id: string) {
    await Promise.resolve();
    const collection = this.collections.find((item) => item.id === id);
    return collection
      ? {
          ...collection,
          totalHadiths: this.items.filter(
            (item) => item.collectionId === collection.id,
          ).length,
        }
      : null;
  }

  async findCollectionByKey(key: string, activeOnly = false) {
    await Promise.resolve();
    const collection = this.collections.find(
      (item) => item.key === key && (!activeOnly || item.isActive),
    );
    return collection
      ? {
          ...collection,
          totalHadiths: this.items.filter(
            (item) =>
              item.collectionId === collection.id &&
              (!activeOnly || item.isActive),
          ).length,
        }
      : null;
  }

  async createCollection(data: Partial<HadithCollectionModel>) {
    await Promise.resolve();
    const now = new Date();
    const collection: HadithCollectionModel = {
      id: `collection-${++this.sequence}`,
      key: data.key!,
      name: data.name!,
      arabicName: data.arabicName!,
      author: data.author!,
      reliability: data.reliability ?? null,
      description: data.description ?? null,
      sourceName: data.sourceName ?? null,
      sourceUrl: data.sourceUrl ?? null,
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    this.collections.push(collection);
    return collection;
  }

  async updateCollection(id: string, data: Partial<HadithCollectionModel>) {
    await Promise.resolve();
    const index = this.collections.findIndex((item) => item.id === id);
    this.collections[index] = {
      ...this.collections[index],
      ...data,
      updatedAt: new Date(),
    };
    return this.collections[index];
  }

  async deleteCollection(id: string) {
    await Promise.resolve();
    this.collections = this.collections.filter((item) => item.id !== id);
  }

  async countItems(collectionId: string, activeOnly = false) {
    await Promise.resolve();
    return this.items.filter(
      (item) =>
        item.collectionId === collectionId && (!activeOnly || item.isActive),
    ).length;
  }

  async listItems(
    collectionId: string,
    filters: HadithItemFilters,
    activeOnly = false,
  ) {
    await Promise.resolve();
    let items = this.items.filter(
      (item) =>
        item.collectionId === collectionId && (!activeOnly || item.isActive),
    );
    if (!activeOnly && filters.isActive !== undefined) {
      items = items.filter((item) => item.isActive === filters.isActive);
    }
    if (filters.grade) {
      items = items.filter((item) => item.grade === filters.grade);
    }
    if (filters.hadithNumber !== undefined) {
      items = items.filter(
        (item) => item.hadithNumber === filters.hadithNumber,
      );
    }
    const start = (filters.page - 1) * filters.limit;
    const pagedItems = items.slice(start, start + filters.limit);
    return {
      items: pagedItems,
      page: filters.page,
      limit: filters.limit,
      hasNextPage: pagedItems.length === filters.limit,
    };
  }

  async findItemById(id: string) {
    await Promise.resolve();
    return this.items.find((item) => item.id === id) ?? null;
  }

  async findItemByNumber(
    collectionId: string,
    hadithNumber: number,
    activeOnly = false,
  ) {
    await Promise.resolve();
    return (
      this.items.find(
        (item) =>
          item.collectionId === collectionId &&
          item.hadithNumber === hadithNumber &&
          (!activeOnly || item.isActive),
      ) ?? null
    );
  }

  async createItem(data: Partial<HadithItemModel>) {
    await Promise.resolve();
    const now = new Date();
    const item: HadithItemModel = {
      id: `item-${++this.sequence}`,
      collectionId: data.collectionId!,
      hadithNumber: data.hadithNumber!,
      arabic: data.arabic!,
      english: data.english ?? null,
      french: data.french ?? null,
      grade: data.grade ?? null,
      narrator: data.narrator ?? null,
      chapter: data.chapter ?? null,
      sourceReference: data.sourceReference ?? null,
      isActive: data.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    this.items.push(item);
    return item;
  }

  async updateItem(id: string, data: Partial<HadithItemModel>) {
    await Promise.resolve();
    const index = this.items.findIndex((item) => item.id === id);
    this.items[index] = {
      ...this.items[index],
      ...data,
      updatedAt: new Date(),
    };
    return this.items[index];
  }

  async deleteItem(id: string) {
    await Promise.resolve();
    this.items = this.items.filter((item) => item.id !== id);
  }
}

describe('Hadith management use cases', () => {
  let persistence: InMemoryHadithPersistence;
  let collections: ManageHadithCollectionsUsecase;
  let items: ManageHadithItemsUsecase;
  let publicHadith: GetPublicHadithUsecase;

  beforeEach(() => {
    persistence = new InMemoryHadithPersistence();
    collections = new ManageHadithCollectionsUsecase(persistence);
    items = new ManageHadithItemsUsecase(persistence);
    publicHadith = new GetPublicHadithUsecase(persistence);
  });

  async function createCollection(isActive = true) {
    return collections.create({
      key: 'bukhari',
      name: 'Sahih al-Bukhari',
      arabicName: 'صحيح البخاري',
      author: 'Imam Bukhari',
      isActive,
    });
  }

  it('creates a collection and rejects a duplicate key', async () => {
    await expect(createCollection()).resolves.toMatchObject({
      key: 'bukhari',
      isActive: true,
    });

    await expect(createCollection()).rejects.toBeInstanceOf(ConflictException);
  });

  it('creates a Hadith item and rejects a duplicate number', async () => {
    const collection = await createCollection();
    await expect(
      items.create(collection.id, { hadithNumber: 1, arabic: 'حديث صحيح' }),
    ).resolves.toMatchObject({
      collectionId: collection.id,
      hadithNumber: 1,
    });

    await expect(
      items.create(collection.id, { hadithNumber: 1, arabic: 'مكرر' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('returns only active public content and actual active totals', async () => {
    const collection = await createCollection();
    await collections.create({
      key: 'inactive',
      name: 'Inactive',
      arabicName: 'غير نشط',
      author: 'Author',
      isActive: false,
    });
    await items.create(collection.id, {
      hadithNumber: 1,
      arabic: 'نشط',
      isActive: true,
    });
    await items.create(collection.id, {
      hadithNumber: 2,
      arabic: 'غير نشط',
      isActive: false,
    });

    const collectionResult = await publicHadith.listCollections({
      page: 1,
      limit: 100,
    });
    const itemResult = await publicHadith.listItems('bukhari', {
      page: 1,
      limit: 10,
    });
    const response = HadithResponseMapper.collections(
      collectionResult,
      new Date('2026-07-14T12:00:00.000Z'),
    );

    expect(collectionResult.items).toHaveLength(1);
    expect(collectionResult.items[0].totalHadiths).toBe(1);
    expect(itemResult.result.items).toHaveLength(1);
    expect(response.data.total_hadiths).toBe(1);
  });

  it('returns correct pagination metadata', async () => {
    const collection = await createCollection();
    for (let number = 1; number <= 3; number += 1) {
      await items.create(collection.id, {
        hadithNumber: number,
        arabic: `حديث ${number}`,
      });
    }

    const { result } = await publicHadith.listItems('bukhari', {
      page: 2,
      limit: 2,
    });
    const response = HadithResponseMapper.items(collection, result);

    expect(response.data).toMatchObject({
      page: 2,
      limit: 2,
      has_next_page: false,
    });
    expect(response.data.hadiths).toHaveLength(1);
  });

  it('prevents deletion of a non-empty collection', async () => {
    const collection = await createCollection();
    await items.create(collection.id, { hadithNumber: 1, arabic: 'حديث' });

    await expect(collections.delete(collection.id)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(persistence.collections).toHaveLength(1);
  });
});
