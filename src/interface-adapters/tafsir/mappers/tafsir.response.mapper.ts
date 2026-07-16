import {
  PaginatedResult,
  PublicPaginatedResult,
} from '../../../domain/shared/model/paginated-result.model';
import { TafsirCollectionModel } from '../../../domain/tafsir/model/tafsir-collection.model';
import {
  TafsirItemModel,
  TafsirPublicListItemModel,
} from '../../../domain/tafsir/model/tafsir-item.model';

export class TafsirResponseMapper {
  static collections(
    result: PaginatedResult<TafsirCollectionModel>,
    now = new Date(),
  ) {
    const timestamp = now.toISOString();
    const collections = result.items.map((collection) =>
      this.collection(collection),
    );

    return {
      success: true,
      service: 'tafsir-collections',
      data: {
        collections,
        total_tafsirs: collections.reduce(
          (total, collection) => total + collection.total_tafsirs,
          0,
        ),
        fetched_at: timestamp,
        source: 'NourApp database',
      },
      timestamp,
    };
  }

  static collectionDetail(collection: TafsirCollectionModel, now = new Date()) {
    return {
      success: true,
      service: 'tafsir-collection',
      data: this.collection(collection),
      timestamp: now.toISOString(),
    };
  }

  static items(
    collection: TafsirCollectionModel,
    result: PublicPaginatedResult<TafsirPublicListItemModel>,
    now = new Date(),
  ) {
    return {
      success: true,
      service: 'tafsir-collection',
      data: {
        collection: collection.key,
        collection_name: collection.name,
        language: collection.language,
        page: result.page,
        limit: result.limit,
        has_next_page: result.hasNextPage,
        tafsirs: result.items.map((item) => this.publicItem(collection, item)),
      },
      timestamp: now.toISOString(),
    };
  }

  static itemDetail(
    collection: TafsirCollectionModel,
    item: TafsirItemModel,
    now = new Date(),
  ) {
    return {
      success: true,
      service: 'tafsir',
      data: this.item(collection, item),
      timestamp: now.toISOString(),
    };
  }

  private static collection(collection: TafsirCollectionModel) {
    return {
      key: collection.key,
      name: collection.name,
      arabic_name: collection.arabicName ?? null,
      author: collection.author,
      language: collection.language,
      description: collection.description ?? null,
      source_name: collection.sourceName ?? null,
      source_url: collection.sourceUrl ?? null,
      total_tafsirs: collection.totalTafsirs ?? 0,
    };
  }

  private static item(
    collection: TafsirCollectionModel,
    item: TafsirItemModel,
  ) {
    return {
      id: `${collection.key}-${item.surahNumber}-${item.ayahNumber}`,
      collection: collection.key,
      collection_name: collection.name,
      language: collection.language,
      surah_number: item.surahNumber,
      surah_name: item.surahName ?? null,
      ayah_number: item.ayahNumber,
      title: item.title ?? null,
      content: item.content,
      source_reference: item.sourceReference ?? null,
    };
  }

  private static publicItem(
    collection: TafsirCollectionModel,
    item: TafsirPublicListItemModel,
  ) {
    return {
      id: `${collection.key}-${item.surahNumber}-${item.ayahNumber}`,
      collection: collection.key,
      collection_name: collection.name,
      language: collection.language,
      surah_number: item.surahNumber,
      surah_name: item.surahName ?? null,
      ayah_number: item.ayahNumber,
      title: item.title ?? null,
      source_reference: item.sourceReference ?? null,
    };
  }
}
