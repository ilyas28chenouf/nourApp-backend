import { Injectable } from '@nestjs/common';
import { HadithCollectionModel } from '../../domain/hadith/model/hadith-collection.model';
import { HadithItemModel } from '../../domain/hadith/model/hadith-item.model';
import {
  HadithCollectionFilters,
  HadithItemFilters,
} from '../../domain/hadith/ports/hadith-persistence.port';
import { HadithTypeormAdapter } from '../../infrastructure/hadith/adapters/hadith-typeorm.adapter';
import { GetPublicHadithUsecase } from '../../usecases/hadith/get-public-hadith.usecase';
import { ManageHadithCollectionsUsecase } from '../../usecases/hadith/manage-hadith-collections.usecase';
import { ManageHadithItemsUsecase } from '../../usecases/hadith/manage-hadith-items.usecase';

@Injectable()
export class HadithUsecasesProxyService {
  private readonly collections: ManageHadithCollectionsUsecase;
  private readonly items: ManageHadithItemsUsecase;
  private readonly publicHadith: GetPublicHadithUsecase;

  constructor(persistence: HadithTypeormAdapter) {
    this.collections = new ManageHadithCollectionsUsecase(persistence);
    this.items = new ManageHadithItemsUsecase(persistence);
    this.publicHadith = new GetPublicHadithUsecase(persistence);
  }

  listCollections(filters: HadithCollectionFilters) {
    return this.collections.list(filters);
  }

  getCollection(id: string) {
    return this.collections.get(id);
  }

  createCollection(data: Partial<HadithCollectionModel>) {
    return this.collections.create(data);
  }

  updateCollection(id: string, data: Partial<HadithCollectionModel>) {
    return this.collections.update(id, data);
  }

  deleteCollection(id: string) {
    return this.collections.delete(id);
  }

  listItems(collectionId: string, filters: HadithItemFilters) {
    return this.items.list(collectionId, filters);
  }

  getItem(id: string) {
    return this.items.get(id);
  }

  createItem(collectionId: string, data: Partial<HadithItemModel>) {
    return this.items.create(collectionId, data);
  }

  updateItem(id: string, data: Partial<HadithItemModel>) {
    return this.items.update(id, data);
  }

  deleteItem(id: string) {
    return this.items.delete(id);
  }

  listPublicCollections(filters: HadithCollectionFilters) {
    return this.publicHadith.listCollections(filters);
  }

  getPublicCollection(key: string) {
    return this.publicHadith.getCollection(key);
  }

  listPublicItems(key: string, filters: HadithItemFilters) {
    return this.publicHadith.listItems(key, filters);
  }

  getPublicItem(key: string, hadithNumber: number) {
    return this.publicHadith.getItem(key, hadithNumber);
  }
}
