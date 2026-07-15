import { ConflictException } from '@nestjs/common';
import { TafsirCollectionModel } from '../../domain/tafsir/model/tafsir-collection.model';
import { TafsirItemModel } from '../../domain/tafsir/model/tafsir-item.model';
import { TafsirPersistencePort } from '../../domain/tafsir/ports/tafsir-persistence.port';
import { TafsirResponseMapper } from '../../interface-adapters/tafsir/mappers/tafsir.response.mapper';
import { GetPublicTafsirUsecase } from './get-public-tafsir.usecase';
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
    findItemById: jest.fn(),
    findItemByLocation: jest.fn(),
    createItem: jest.fn(),
    updateItem: jest.fn(),
    deleteItem: jest.fn(),
  } as jest.Mocked<TafsirPersistencePort>;
}

describe('Tafsir management use cases', () => {
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

  it('requests only active public collections and items', async () => {
    const persistence = createPersistence();
    persistence.listCollections.mockResolvedValue({
      items: [collection],
      page: 1,
      limit: 100,
      total: 1,
      totalPages: 1,
    });
    persistence.findCollectionByKey.mockResolvedValue(collection);
    persistence.listItems.mockResolvedValue({
      items: [item],
      page: 1,
      limit: 20,
      hasNextPage: false,
    });
    const usecase = new GetPublicTafsirUsecase(persistence);

    const collections = await usecase.listCollections({ page: 1, limit: 100 });
    const entries = await usecase.listItems('ibn-kathir', {
      page: 1,
      limit: 20,
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
    expect(persistence.listItems.mock.calls[0]).toEqual([
      collection.id,
      { page: 1, limit: 20 },
      true,
    ]);
    expect(collections.items[0].totalTafsirs).toBe(1);
    expect(response.data.has_next_page).toBe(false);
    expect(response.data.tafsirs[0].id).toBe('ibn-kathir-1-1');
  });
});
