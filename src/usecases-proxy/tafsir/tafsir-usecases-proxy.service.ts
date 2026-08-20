import { Injectable } from '@nestjs/common';
import { TafsirCollectionModel } from '../../domain/tafsir/model/tafsir-collection.model';
import { TafsirItemModel } from '../../domain/tafsir/model/tafsir-item.model';
import {
  TafsirCollectionFilters,
  TafsirItemFilters,
} from '../../domain/tafsir/ports/tafsir-persistence.port';
import { TafsirTypeormAdapter } from '../../infrastructure/tafsir/adapters/tafsir-typeorm.adapter';
import { GetPublicTafsirUsecase } from '../../usecases/tafsir/get-public-tafsir.usecase';
import { ManageTafsirCollectionsUsecase } from '../../usecases/tafsir/manage-tafsir-collections.usecase';
import { ManageTafsirItemsUsecase } from '../../usecases/tafsir/manage-tafsir-items.usecase';
import { ManageTafsirProgressUsecase } from '../../usecases/tafsir/manage-tafsir-progress.usecase';

@Injectable()
export class TafsirUsecasesProxyService {
  private readonly collections: ManageTafsirCollectionsUsecase;
  private readonly items: ManageTafsirItemsUsecase;
  private readonly publicTafsir: GetPublicTafsirUsecase;
  private readonly progress: ManageTafsirProgressUsecase;

  constructor(persistence: TafsirTypeormAdapter) {
    this.collections = new ManageTafsirCollectionsUsecase(persistence);
    this.items = new ManageTafsirItemsUsecase(persistence);
    this.publicTafsir = new GetPublicTafsirUsecase(persistence);
    this.progress = new ManageTafsirProgressUsecase(persistence);
  }

  listCollections(filters: TafsirCollectionFilters) {
    return this.collections.list(filters);
  }

  getCollection(id: string) {
    return this.collections.get(id);
  }

  createCollection(data: Partial<TafsirCollectionModel>) {
    return this.collections.create(data);
  }

  updateCollection(id: string, data: Partial<TafsirCollectionModel>) {
    return this.collections.update(id, data);
  }

  deleteCollection(id: string) {
    return this.collections.delete(id);
  }

  listItems(collectionId: string, filters: TafsirItemFilters) {
    return this.items.list(collectionId, filters);
  }

  getItem(id: string) {
    return this.items.get(id);
  }

  createItem(collectionId: string, data: Partial<TafsirItemModel>) {
    return this.items.create(collectionId, data);
  }

  updateItem(id: string, data: Partial<TafsirItemModel>) {
    return this.items.update(id, data);
  }

  deleteItem(id: string) {
    return this.items.delete(id);
  }

  listPublicCollections(filters: TafsirCollectionFilters) {
    return this.publicTafsir.listCollections(filters);
  }

  getPublicCollection(key: string) {
    return this.publicTafsir.getCollection(key);
  }

  listPublicItems(key: string, filters: TafsirItemFilters) {
    return this.publicTafsir.listItems(key, filters);
  }

  getPublicItem(key: string, surahNumber: number, ayahNumber: number) {
    return this.publicTafsir.getItem(key, surahNumber, ayahNumber);
  }

  listProgress(userId: string, from?: string, to?: string) {
    return this.progress.list(userId, from, to);
  }

  createProgress(userId: string, data: Record<string, any>) {
    return this.progress.create(userId, data);
  }

  updateProgress(userId: string, id: string, data: Record<string, any>) {
    return this.progress.update(userId, id, data);
  }
}
