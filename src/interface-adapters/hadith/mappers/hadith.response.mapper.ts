import { HadithCollectionModel } from '../../../domain/hadith/model/hadith-collection.model';
import { HadithItemModel } from '../../../domain/hadith/model/hadith-item.model';
import { PaginatedResult } from '../../../domain/shared/model/paginated-result.model';

export class HadithResponseMapper {
  static collections(
    result: PaginatedResult<HadithCollectionModel>,
    now = new Date(),
  ) {
    const timestamp = now.toISOString();
    const collections = result.items.map((collection) =>
      this.collection(collection),
    );

    return {
      success: true,
      service: 'hadith-collections',
      data: {
        collections,
        total_hadiths: collections.reduce(
          (total, collection) => total + collection.total_hadiths,
          0,
        ),
        fetched_at: timestamp,
        source: 'NourApp database',
      },
      timestamp,
    };
  }

  static collectionDetail(collection: HadithCollectionModel, now = new Date()) {
    return {
      success: true,
      service: 'hadith-collection',
      data: this.collection(collection),
      timestamp: now.toISOString(),
    };
  }

  static items(
    collection: HadithCollectionModel,
    result: PaginatedResult<HadithItemModel>,
    now = new Date(),
  ) {
    return {
      success: true,
      service: 'hadith-collection',
      data: {
        collection: collection.key,
        collection_name: collection.name,
        page: result.page,
        limit: result.limit,
        total: result.total,
        total_pages: result.totalPages,
        hadiths: result.items.map((item) => this.item(collection, item)),
      },
      timestamp: now.toISOString(),
    };
  }

  static itemDetail(
    collection: HadithCollectionModel,
    item: HadithItemModel,
    now = new Date(),
  ) {
    return {
      success: true,
      service: 'hadith',
      data: this.item(collection, item),
      timestamp: now.toISOString(),
    };
  }

  private static collection(collection: HadithCollectionModel) {
    return {
      key: collection.key,
      name: collection.name,
      arabic_name: collection.arabicName,
      author: collection.author,
      reliability: collection.reliability ?? null,
      description: collection.description ?? null,
      source_name: collection.sourceName ?? null,
      source_url: collection.sourceUrl ?? null,
      total_hadiths: collection.totalHadiths ?? 0,
    };
  }

  private static item(
    collection: HadithCollectionModel,
    item: HadithItemModel,
  ) {
    return {
      id: `${collection.key}-${item.hadithNumber}`,
      collection: collection.key,
      collection_name: collection.name,
      hadithnumber: item.hadithNumber,
      arabic: item.arabic,
      english: item.english ?? null,
      french: item.french ?? null,
      grade: item.grade ?? null,
      narrator: item.narrator ?? null,
      chapter: item.chapter ?? null,
      source_reference: item.sourceReference ?? null,
    };
  }
}
