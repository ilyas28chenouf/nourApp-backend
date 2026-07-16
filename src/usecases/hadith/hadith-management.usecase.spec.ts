import { ConflictException } from '@nestjs/common';
import { HadithCollectionModel } from '../../domain/hadith/model/hadith-collection.model';
import {
  HadithItemModel,
  HadithPublicListItemModel,
} from '../../domain/hadith/model/hadith-item.model';
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

  async listCollections(filters: HadithCollectionFilters, publicOnly = false) {
    await Promise.resolve();
    let collections = this.collections.filter(
      (collection) =>
        !publicOnly || (collection.isActive && collection.published),
    );

    if (!publicOnly && filters.isActive !== undefined) {
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
            (!publicOnly || item.isActive),
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

  async findCollectionByKey(key: string, publicOnly = false) {
    await Promise.resolve();
    const collection = this.collections.find(
      (item) =>
        item.key === key && (!publicOnly || (item.isActive && item.published)),
    );
    return collection
      ? {
          ...collection,
          totalHadiths: this.items.filter(
            (item) =>
              item.collectionId === collection.id &&
              (!publicOnly || item.isActive),
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
      published: data.published ?? true,
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

  async listItems(collectionId: string, filters: HadithItemFilters) {
    await Promise.resolve();
    let items = this.filteredItems(collectionId, filters, false);
    if (filters.isActive !== undefined) {
      items = items.filter((item) => item.isActive === filters.isActive);
    }

    const total = items.length;
    const start = (filters.page - 1) * filters.limit;
    return {
      items: items.slice(start, start + filters.limit),
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: Math.ceil(total / filters.limit),
    };
  }

  async listPublicItems(collectionId: string, filters: HadithItemFilters) {
    await Promise.resolve();
    const items = this.filteredItems(collectionId, filters, true);
    const start = (filters.page - 1) * filters.limit;
    const rows = items.slice(start, start + filters.limit + 1);
    const publicItems: HadithPublicListItemModel[] = rows
      .slice(0, filters.limit)
      .map((item) => ({
        hadithNumber: item.hadithNumber,
        grade: item.grade,
        narrator: item.narrator,
        chapter: item.chapter,
        sourceReference: item.sourceReference,
      }));

    return {
      items: publicItems,
      page: filters.page,
      limit: filters.limit,
      hasNextPage: rows.length > filters.limit,
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

  private filteredItems(
    collectionId: string,
    filters: HadithItemFilters,
    activeOnly: boolean,
  ) {
    let items = this.items.filter(
      (item) =>
        item.collectionId === collectionId && (!activeOnly || item.isActive),
    );
    if (filters.search) {
      const search = filters.search.toLowerCase();
      items = items.filter((item) =>
        [
          item.arabic,
          item.english,
          item.french,
          item.narrator,
          item.chapter,
        ].some((value) => value?.toLowerCase().includes(search)),
      );
    }
    if (filters.grade) {
      items = items.filter((item) => item.grade === filters.grade);
    }
    if (filters.hadithNumber !== undefined) {
      items = items.filter(
        (item) => item.hadithNumber === filters.hadithNumber,
      );
    }
    return items;
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

  async function createCollection(
    key = 'bukhari',
    isActive = true,
    published?: boolean,
  ) {
    return collections.create({
      key,
      name: 'Sahih al-Bukhari',
      arabicName: 'صحيح البخاري',
      author: 'Imam Bukhari',
      isActive,
      ...(published !== undefined ? { published } : {}),
    });
  }

  it('creates a collection and rejects a duplicate key', async () => {
    await expect(createCollection()).resolves.toMatchObject({
      key: 'bukhari',
      isActive: true,
      published: true,
    });
    await expect(createCollection()).rejects.toBeInstanceOf(ConflictException);
  });

  it('stores explicit published values and defaults omitted published to true', async () => {
    const published = await createCollection('published', true, true);
    const unpublished = await createCollection('unpublished', true, false);
    const defaulted = await createCollection('defaulted');

    expect(published.published).toBe(true);
    expect(unpublished.published).toBe(false);
    expect(defaulted.published).toBe(true);
  });

  it('updates published from true to false and from false to true', async () => {
    const initiallyPublished = await createCollection('first', true, true);
    const initiallyUnpublished = await createCollection('second', true, false);

    await expect(
      collections.update(initiallyPublished.id, { published: false }),
    ).resolves.toMatchObject({ published: false });
    await expect(
      collections.update(initiallyUnpublished.id, { published: true }),
    ).resolves.toMatchObject({ published: true });
  });

  it('includes published in admin collection list and detail results', async () => {
    const collection = await createCollection('unpublished', true, false);
    const list = await collections.list({ page: 1, limit: 10 });
    const detail = await collections.get(collection.id);

    expect(list.items[0]).toHaveProperty('published', false);
    expect(detail).toHaveProperty('published', false);
  });

  it('creates a Hadith item and rejects a duplicate number', async () => {
    const collection = await createCollection();
    await expect(
      items.create(collection.id, {
        hadithNumber: 1,
        arabic: 'حديث صحيح',
      }),
    ).resolves.toMatchObject({
      collectionId: collection.id,
      hadithNumber: 1,
    });

    await expect(
      items.create(collection.id, { hadithNumber: 1, arabic: 'مكرر' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('returns only active and published public content with active totals', async () => {
    const collection = await createCollection();
    await createCollection('inactive', false);
    await createCollection('unpublished', true, false);
    await items.create(collection.id, {
      hadithNumber: 1,
      arabic: 'Active',
      isActive: true,
    });
    await items.create(collection.id, {
      hadithNumber: 2,
      arabic: 'Inactive',
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

  it('omits body text from public lists and keeps it in detail and admin results', async () => {
    const collection = await createCollection();
    const item = await items.create(collection.id, {
      hadithNumber: 1,
      arabic: 'Full Arabic body',
      english: 'Full English body',
      french: 'Full French body',
      grade: 'Sahih',
      narrator: 'Narrator',
    });

    const list = await publicHadith.listItems(collection.key, {
      page: 1,
      limit: 10,
    });
    const listResponse = HadithResponseMapper.items(
      list.collection,
      list.result,
    );
    const detail = await publicHadith.getItem(collection.key, 1);
    const detailResponse = HadithResponseMapper.itemDetail(
      detail.collection,
      detail.item,
    );
    const adminPage = await items.list(collection.id, {
      page: 1,
      limit: 10,
    });

    expect(listResponse.data.hadiths[0]).not.toHaveProperty('arabic');
    expect(listResponse.data.hadiths[0]).not.toHaveProperty('english');
    expect(listResponse.data.hadiths[0]).not.toHaveProperty('french');
    expect(listResponse.data.hadiths[0]).not.toHaveProperty('content');
    expect(detailResponse.data.arabic).toBe(item.arabic);
    expect(detailResponse.data.english).toBe(item.english);
    expect(detailResponse.data.french).toBe(item.french);
    expect(adminPage.items[0].arabic).toBe(item.arabic);
    expect(adminPage.items[0].english).toBe(item.english);
    expect(adminPage.items[0].french).toBe(item.french);
  });

  it('returns correct pagination metadata', async () => {
    const collection = await createCollection();
    for (let number = 1; number <= 3; number += 1) {
      await items.create(collection.id, {
        hadithNumber: number,
        arabic: `Hadith ${number}`,
      });
    }

    const { result } = await publicHadith.listItems('bukhari', {
      page: 2,
      limit: 2,
    });
    const adminResult = await items.list(collection.id, {
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
    expect(adminResult).toMatchObject({
      page: 2,
      limit: 2,
      total: 3,
      totalPages: 2,
    });
  });

  it('preserves public search and grade filters', async () => {
    const collection = await createCollection();
    await items.create(collection.id, {
      hadithNumber: 1,
      arabic: 'Intentions',
      grade: 'Sahih',
    });
    await items.create(collection.id, {
      hadithNumber: 2,
      arabic: 'Charity',
      grade: 'Hasan',
    });

    const { result } = await publicHadith.listItems(collection.key, {
      page: 1,
      limit: 10,
      search: 'intentions',
      grade: 'Sahih',
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].hadithNumber).toBe(1);
  });

  it('prevents deletion of a non-empty collection', async () => {
    const collection = await createCollection();
    await items.create(collection.id, {
      hadithNumber: 1,
      arabic: 'Hadith',
    });

    await expect(collections.delete(collection.id)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(persistence.collections).toHaveLength(1);
  });
});
