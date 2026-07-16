import { ConflictException } from '@nestjs/common';
import { TafsirCollectionModel } from '../../domain/tafsir/model/tafsir-collection.model';
import {
  TafsirItemModel,
  TafsirPublicListItemModel,
} from '../../domain/tafsir/model/tafsir-item.model';
import { TafsirPersistencePort } from '../../domain/tafsir/ports/tafsir-persistence.port';
import { TafsirResponseMapper } from '../../interface-adapters/tafsir/mappers/tafsir.response.mapper';
import { GetPublicTafsirUsecase } from './get-public-tafsir.usecase';
import { ManageTafsirCollectionsUsecase } from './manage-tafsir-collections.usecase';
import { ManageTafsirItemsUsecase } from './manage-tafsir-items.usecase';

const collection: TafsirCollectionModel = {
  id: 'collection-1',
  key: 'ibn-kathir',
  name: 'Tafsir Ibn Kathir',
  arabicName: 'تفسير ابن كثير',
  author: 'Ibn Kathir',
  language: 'ar',
  sortOrder: 0,
  isActive: true,
  published: true,
  totalTafsirs: 1,
  createdAt: new Date('2026-07-14T12:00:00.000Z'),
  updatedAt: new Date('2026-07-14T12:00:00.000Z'),
};

const item: TafsirItemModel = {
  id: 'item-1',
  collectionId: collection.id,
  surahNumber: 1,
  ayahNumber: 1,
  content: 'Verified commentary text.',
  isActive: true,
  createdAt: new Date('2026-07-14T12:00:00.000Z'),
  updatedAt: new Date('2026-07-14T12:00:00.000Z'),
};

const publicItem: TafsirPublicListItemModel = {
  surahNumber: item.surahNumber,
  ayahNumber: item.ayahNumber,
  surahName: 'Al-Fatiha',
};

function createPersistence() {
  return {
    listCollections: jest.fn(),
    findCollectionById: jest.fn(),
    findCollectionByKey: jest.fn(),
    createCollection: jest.fn(),
    updateCollection: jest.fn(),
    deleteCollection: jest.fn(),
    countItems: jest.fn(),
    listItems: jest.fn(),
    listPublicItems: jest.fn(),
    findItemById: jest.fn(),
    findItemByLocation: jest.fn(),
    createItem: jest.fn(),
    updateItem: jest.fn(),
    deleteItem: jest.fn(),
  } as jest.Mocked<TafsirPersistencePort>;
}

describe('Tafsir management use cases', () => {
  it('stores explicit published values and defaults omitted published to true', async () => {
    const persistence = createPersistence();
    persistence.findCollectionByKey.mockResolvedValue(null);
    persistence.createCollection.mockImplementation((data) =>
      Promise.resolve({
        ...collection,
        ...data,
        key: data.key!,
        published: data.published!,
      }),
    );
    const usecase = new ManageTafsirCollectionsUsecase(persistence);

    const published = await usecase.create({
      ...collection,
      key: 'published',
      published: true,
    });
    const unpublished = await usecase.create({
      ...collection,
      key: 'unpublished',
      published: false,
    });
    const defaulted = await usecase.create({
      ...collection,
      key: 'defaulted',
      published: undefined,
    });

    expect(published.published).toBe(true);
    expect(unpublished.published).toBe(false);
    expect(defaulted.published).toBe(true);
  });

  it('updates published from true to false and from false to true', async () => {
    const persistence = createPersistence();
    persistence.findCollectionById
      .mockResolvedValueOnce(collection)
      .mockResolvedValueOnce({ ...collection, published: false });
    persistence.updateCollection.mockImplementation((_id, data) =>
      Promise.resolve({
        ...collection,
        ...data,
      }),
    );
    const usecase = new ManageTafsirCollectionsUsecase(persistence);

    await expect(
      usecase.update(collection.id, { published: false }),
    ).resolves.toMatchObject({ published: false });
    await expect(
      usecase.update(collection.id, { published: true }),
    ).resolves.toMatchObject({ published: true });
    expect(persistence.updateCollection.mock.calls[0][1]).toEqual({
      published: false,
    });
    expect(persistence.updateCollection.mock.calls[1][1]).toEqual({
      published: true,
    });
  });

  it('includes published in admin collection list and detail results', async () => {
    const persistence = createPersistence();
    const unpublished = { ...collection, published: false };
    persistence.listCollections.mockResolvedValue({
      items: [unpublished],
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    });
    persistence.findCollectionById.mockResolvedValue(unpublished);
    const usecase = new ManageTafsirCollectionsUsecase(persistence);

    const list = await usecase.list({ page: 1, limit: 10 });
    const detail = await usecase.get(collection.id);

    expect(list.items[0]).toHaveProperty('published', false);
    expect(detail).toHaveProperty('published', false);
  });

  it('creates a Tafsir item using the route collection and rejects duplicates', async () => {
    const persistence = createPersistence();
    persistence.findCollectionById.mockResolvedValue(collection);
    persistence.findItemByLocation
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(item);
    persistence.createItem.mockResolvedValue(item);
    const usecase = new ManageTafsirItemsUsecase(persistence);

    await expect(
      usecase.create(collection.id, {
        collectionId: 'ignored-body-collection',
        surahNumber: 1,
        ayahNumber: 1,
        content: item.content,
      }),
    ).resolves.toEqual(item);
    expect(persistence.createItem.mock.calls[0][0]).toEqual(
      expect.objectContaining({ collectionId: collection.id }),
    );

    await expect(
      usecase.create(collection.id, {
        surahNumber: 1,
        ayahNumber: 1,
        content: 'Duplicate',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('returns a lightweight 10-item public page without full content', async () => {
    const persistence = createPersistence();
    persistence.listCollections.mockResolvedValue({
      items: [collection],
      page: 1,
      limit: 100,
      total: 1,
      totalPages: 1,
    });
    persistence.findCollectionByKey.mockResolvedValue(collection);
    persistence.listPublicItems.mockResolvedValue({
      items: Array.from({ length: 10 }, (_, index) => ({
        ...publicItem,
        id: `item-${index + 1}`,
        ayahNumber: index + 1,
      })),
      page: 1,
      limit: 10,
      hasNextPage: true,
    });
    const usecase = new GetPublicTafsirUsecase(persistence);

    const collections = await usecase.listCollections({ page: 1, limit: 100 });
    const entries = await usecase.listItems('ibn-kathir', {
      page: 1,
      limit: 10,
    });
    const response = TafsirResponseMapper.items(
      entries.collection,
      entries.result,
    );

    expect(persistence.listCollections.mock.calls[0]).toEqual([
      { page: 1, limit: 100 },
      true,
    ]);
    expect(persistence.findCollectionByKey.mock.calls[0]).toEqual([
      'ibn-kathir',
      true,
    ]);
    expect(persistence.listPublicItems.mock.calls[0]).toEqual([
      collection.id,
      { page: 1, limit: 10 },
    ]);
    expect(persistence.listItems.mock.calls).toHaveLength(0);
    expect(collections.items[0].totalTafsirs).toBe(1);
    expect(response.data.has_next_page).toBe(true);
    expect(response.data.tafsirs).toHaveLength(10);
    expect(response.data.tafsirs[0]).toMatchObject({
      id: 'ibn-kathir-1-1',
      surah_name: 'Al-Fatiha',
    });
    expect(response.data.tafsirs[0]).not.toHaveProperty('content');
    expect(response.data.tafsirs[0]).not.toHaveProperty('content_preview');
  });

  it('keeps complete content in public detail and admin list results', async () => {
    const persistence = createPersistence();
    persistence.findCollectionByKey.mockResolvedValue(collection);
    persistence.findCollectionById.mockResolvedValue(collection);
    persistence.findItemByLocation.mockResolvedValue(item);
    persistence.listItems.mockResolvedValue({
      items: [item],
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    });
    const publicUsecase = new GetPublicTafsirUsecase(persistence);
    const adminUsecase = new ManageTafsirItemsUsecase(persistence);

    const detail = await publicUsecase.getItem('ibn-kathir', 1, 1);
    const detailResponse = TafsirResponseMapper.itemDetail(
      detail.collection,
      detail.item,
    );
    const adminPage = await adminUsecase.list(collection.id, {
      page: 1,
      limit: 10,
    });

    expect(detailResponse.data.content).toBe(item.content);
    expect(adminPage.items[0].content).toBe(item.content);
    expect(persistence.listItems.mock.calls[0]).toEqual([
      collection.id,
      { page: 1, limit: 10 },
    ]);
  });
});
