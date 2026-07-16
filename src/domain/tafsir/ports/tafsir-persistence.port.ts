import {
  PaginatedResult,
  PublicPaginatedResult,
} from '../../shared/model/paginated-result.model';
import { TafsirCollectionModel } from '../model/tafsir-collection.model';
import {
  TafsirItemModel,
  TafsirPublicListItemModel,
} from '../model/tafsir-item.model';

export const TAFSIR_PERSISTENCE_PORT = Symbol('TAFSIR_PERSISTENCE_PORT');

export interface TafsirCollectionFilters {
  page: number;
  limit: number;
  search?: string;
  language?: string;
  isActive?: boolean;
}

export interface TafsirItemFilters {
  page: number;
  limit: number;
  search?: string;
  surahNumber?: number;
  ayahNumber?: number;
  isActive?: boolean;
}

export interface TafsirPersistencePort {
  listCollections(
    filters: TafsirCollectionFilters,
    activeOnly?: boolean,
  ): Promise<PaginatedResult<TafsirCollectionModel>>;
  findCollectionById(id: string): Promise<TafsirCollectionModel | null>;
  findCollectionByKey(
    key: string,
    activeOnly?: boolean,
  ): Promise<TafsirCollectionModel | null>;
  createCollection(
    data: Partial<TafsirCollectionModel>,
  ): Promise<TafsirCollectionModel>;
  updateCollection(
    id: string,
    data: Partial<TafsirCollectionModel>,
  ): Promise<TafsirCollectionModel>;
  deleteCollection(id: string): Promise<void>;
  countItems(collectionId: string, activeOnly?: boolean): Promise<number>;
  listItems(
    collectionId: string,
    filters: TafsirItemFilters,
  ): Promise<PaginatedResult<TafsirItemModel>>;
  listPublicItems(
    collectionId: string,
    filters: TafsirItemFilters,
  ): Promise<PublicPaginatedResult<TafsirPublicListItemModel>>;
  findItemById(id: string): Promise<TafsirItemModel | null>;
  findItemByLocation(
    collectionId: string,
    surahNumber: number,
    ayahNumber: number,
    activeOnly?: boolean,
  ): Promise<TafsirItemModel | null>;
  createItem(data: Partial<TafsirItemModel>): Promise<TafsirItemModel>;
  updateItem(
    id: string,
    data: Partial<TafsirItemModel>,
  ): Promise<TafsirItemModel>;
  deleteItem(id: string): Promise<void>;
}
