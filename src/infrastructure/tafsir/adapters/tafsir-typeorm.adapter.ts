import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import {
  PaginatedResult,
  PublicPaginatedResult,
} from '../../../domain/shared/model/paginated-result.model';
import {
  TafsirItemModel,
  TafsirPublicListItemModel,
} from '../../../domain/tafsir/model/tafsir-item.model';
import {
  TafsirCollectionFilters,
  TafsirItemFilters,
  TafsirPersistencePort,
} from '../../../domain/tafsir/ports/tafsir-persistence.port';
import { TafsirCollectionTypeormEntity } from '../entities/tafsir-collection.typeorm-entity';
import { TafsirItemTypeormEntity } from '../entities/tafsir-item.typeorm-entity';

@Injectable()
export class TafsirTypeormAdapter implements TafsirPersistencePort {
  private readonly collections: Repository<TafsirCollectionTypeormEntity>;
  private readonly items: Repository<TafsirItemTypeormEntity>;

  constructor(dataSource: DataSource) {
    this.collections = dataSource.getRepository(TafsirCollectionTypeormEntity);
    this.items = dataSource.getRepository(TafsirItemTypeormEntity);
  }

  async listCollections(filters: TafsirCollectionFilters, activeOnly = false) {
    const { page, limit, skip } = this.pagination(
      filters,
      activeOnly ? Number.MAX_SAFE_INTEGER : 100,
    );
    const query = this.collectionQuery(activeOnly);

    if (!activeOnly && filters.isActive !== undefined) {
      query.andWhere('collection.isActive = :isActive', {
        isActive: filters.isActive,
      });
    }
    if (filters.search) {
      query.andWhere(
        '(collection.key ILIKE :search OR collection.name ILIKE :search OR collection.arabicName ILIKE :search OR collection.author ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }
    if (filters.language) {
      query.andWhere('collection.language ILIKE :language', {
        language: filters.language,
      });
    }

    const [items, total] = await query
      .orderBy('collection.sortOrder', 'ASC')
      .addOrderBy('collection.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return this.paginate(items, page, limit, total);
  }

  findCollectionById(id: string) {
    return this.collectionQuery(false)
      .andWhere('collection.id = :id', { id })
      .getOne();
  }

  findCollectionByKey(key: string, activeOnly = false) {
    return this.collections.findOne({
      where: activeOnly ? { key, isActive: true, published: true } : { key },
    });
  }

  async createCollection(data: Partial<TafsirCollectionTypeormEntity>) {
    try {
      return await this.collections.save(this.collections.create(data));
    } catch (error) {
      this.rethrowUnique(error, 'Tafsir collection key already exists');
      throw error;
    }
  }

  async updateCollection(
    id: string,
    data: Partial<TafsirCollectionTypeormEntity>,
  ) {
    const existing = await this.collections.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Tafsir collection not found');

    try {
      return await this.collections.save({
        ...existing,
        ...this.stripUndefined(data),
      });
    } catch (error) {
      this.rethrowUnique(error, 'Tafsir collection key already exists');
      throw error;
    }
  }

  async deleteCollection(id: string) {
    try {
      await this.collections.delete(id);
    } catch (error) {
      if (this.databaseErrorCode(error) === '23503') {
        throw new ConflictException(
          'Cannot delete a Tafsir collection that contains items',
        );
      }
      throw error;
    }
  }

  countItems(collectionId: string, activeOnly = false) {
    return this.items.count({
      where: activeOnly ? { collectionId, isActive: true } : { collectionId },
    });
  }

  async listItems(
    collectionId: string,
    filters: TafsirItemFilters,
  ): Promise<PaginatedResult<TafsirItemModel>> {
    const { page, limit, skip } = this.pagination(filters);
    const query = this.items
      .createQueryBuilder('item')
      .where('item.collectionId = :collectionId', { collectionId });

    if (filters.isActive !== undefined) {
      query.andWhere('item.isActive = :isActive', {
        isActive: filters.isActive,
      });
    }
    if (filters.search) {
      query.andWhere(
        '(item.content ILIKE :search OR item.title ILIKE :search OR item.surahName ILIKE :search OR item.sourceReference ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }
    if (filters.surahNumber !== undefined) {
      query.andWhere('item.surahNumber = :surahNumber', {
        surahNumber: filters.surahNumber,
      });
    }
    if (filters.ayahNumber !== undefined) {
      query.andWhere('item.ayahNumber = :ayahNumber', {
        ayahNumber: filters.ayahNumber,
      });
    }

    const [items, total] = await query
      .orderBy('item.surahNumber', 'ASC')
      .addOrderBy('item.ayahNumber', 'ASC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return this.paginate(items, page, limit, total);
  }

  async listPublicItems(
    collectionId: string,
    filters: TafsirItemFilters,
  ): Promise<PublicPaginatedResult<TafsirPublicListItemModel>> {
    const { page, limit, skip } = this.pagination(filters);
    const query = this.items
      .createQueryBuilder('item')
      .select('item.surahNumber', 'surahNumber')
      .addSelect('item.ayahNumber', 'ayahNumber')
      .addSelect('item.surahName', 'surahName')
      .addSelect('item.title', 'title')
      .addSelect('item.sourceReference', 'sourceReference')
      .where('item.collectionId = :collectionId', { collectionId })
      .andWhere('item.isActive = true');

    if (filters.search) {
      query.andWhere(
        '(item.content ILIKE :search OR item.title ILIKE :search OR item.surahName ILIKE :search OR item.sourceReference ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }
    if (filters.surahNumber !== undefined) {
      query.andWhere('item.surahNumber = :surahNumber', {
        surahNumber: filters.surahNumber,
      });
    }
    if (filters.ayahNumber !== undefined) {
      query.andWhere('item.ayahNumber = :ayahNumber', {
        ayahNumber: filters.ayahNumber,
      });
    }

    const rows = await query
      .orderBy('item.surahNumber', 'ASC')
      .addOrderBy('item.ayahNumber', 'ASC')
      .skip(skip)
      .take(limit + 1)
      .getRawMany<TafsirPublicListItemModel>();

    return {
      items: rows.slice(0, limit),
      page,
      limit,
      hasNextPage: rows.length > limit,
    };
  }

  findItemById(id: string) {
    return this.items.findOne({ where: { id } });
  }

  findItemByLocation(
    collectionId: string,
    surahNumber: number,
    ayahNumber: number,
    activeOnly = false,
  ) {
    return this.items.findOne({
      where: activeOnly
        ? { collectionId, surahNumber, ayahNumber, isActive: true }
        : { collectionId, surahNumber, ayahNumber },
    });
  }

  async createItem(data: Partial<TafsirItemTypeormEntity>) {
    try {
      return await this.items.save(this.items.create(data));
    } catch (error) {
      this.rethrowUnique(
        error,
        'Tafsir entry already exists for this collection, surah and ayah',
      );
      throw error;
    }
  }

  async updateItem(id: string, data: Partial<TafsirItemTypeormEntity>) {
    const existing = await this.items.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Tafsir item not found');

    try {
      return await this.items.save({
        ...existing,
        ...this.stripUndefined(data),
      });
    } catch (error) {
      this.rethrowUnique(
        error,
        'Tafsir entry already exists for this collection, surah and ayah',
      );
      throw error;
    }
  }

  async deleteItem(id: string) {
    await this.items.delete(id);
  }

  private collectionQuery(activeOnly: boolean) {
    const query = this.collections.createQueryBuilder('collection');
    if (activeOnly) {
      query
        .where('collection.isActive = true')
        .andWhere('collection.published = true');
    }

    return query.loadRelationCountAndMap(
      'collection.totalTafsirs',
      'collection.items',
      'countedItem',
      activeOnly
        ? (itemsQuery) =>
            itemsQuery.andWhere('countedItem.isActive = :countedItemActive', {
              countedItemActive: true,
            })
        : undefined,
    );
  }

  private pagination(
    filters: { page: number; limit: number },
    maximumLimit = 100,
  ) {
    const page = this.toNumber(filters.page);
    const limit = this.toNumber(filters.limit);

    if (!Number.isInteger(page) || page < 1) {
      throw new BadRequestException('page must be a positive integer');
    }
    if (!Number.isInteger(limit) || limit < 1 || limit > maximumLimit) {
      throw new BadRequestException('limit must be between 1 and 100');
    }

    const skip = (page - 1) * limit;
    if (!Number.isSafeInteger(skip) || skip < 0) {
      throw new BadRequestException('page must be a positive integer');
    }

    return { page, limit, skip };
  }

  private toNumber(value: unknown) {
    try {
      return Number(value);
    } catch {
      return Number.NaN;
    }
  }

  private paginate<T>(items: T[], page: number, limit: number, total: number) {
    return {
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  private stripUndefined<T extends object>(data: T) {
    return Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    );
  }

  private rethrowUnique(error: unknown, message: string) {
    if (this.databaseErrorCode(error) === '23505') {
      throw new ConflictException(message);
    }
  }

  private databaseErrorCode(error: unknown) {
    if (!(error instanceof QueryFailedError)) return undefined;
    return (error.driverError as { code?: string } | undefined)?.code;
  }
}
