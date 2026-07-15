import {
  PaginatedResult,
  UncountedPaginatedResult,
} from '../../shared/model/paginated-result.model';
import { HadithCollectionModel } from '../model/hadith-collection.model';
import { HadithItemModel } from '../model/hadith-item.model';

export const HADITH_PERSISTENCE_PORT = Symbol('HADITH_PERSISTENCE_PORT');

export interface HadithCollectionFilters {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
}

export interface HadithItemFilters {
  page: number;
  limit: number;
  search?: string;
  grade?: string;
  isActive?: boolean;
  hadithNumber?: number;
}

export interface HadithPersistencePort {
  listCollections(
    filters: HadithCollectionFilters,
    activeOnly?: boolean,
  ): Promise<PaginatedResult<HadithCollectionModel>>;
  findCollectionById(id: string): Promise<HadithCollectionModel | null>;
  findCollectionByKey(
    key: string,
    activeOnly?: boolean,
  ): Promise<HadithCollectionModel | null>;
  createCollection(
    data: Partial<HadithCollectionModel>,
  ): Promise<HadithCollectionModel>;
  updateCollection(
    id: string,
    data: Partial<HadithCollectionModel>,
  ): Promise<HadithCollectionModel>;
  deleteCollection(id: string): Promise<void>;
  countItems(collectionId: string, activeOnly?: boolean): Promise<number>;
  listItems(
    collectionId: string,
    filters: HadithItemFilters,
    activeOnly?: boolean,
  ): Promise<UncountedPaginatedResult<HadithItemModel>>;
  findItemById(id: string): Promise<HadithItemModel | null>;
  findItemByNumber(
    collectionId: string,
    hadithNumber: number,
    activeOnly?: boolean,
  ): Promise<HadithItemModel | null>;
  createItem(data: Partial<HadithItemModel>): Promise<HadithItemModel>;
  updateItem(
    id: string,
    data: Partial<HadithItemModel>,
  ): Promise<HadithItemModel>;
  deleteItem(id: string): Promise<void>;
}
