import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import {
  HadithItemModel,
  HadithPublicListItemModel,
} from '../../../domain/hadith/model/hadith-item.model';
import {
  PaginatedResult,
  PublicPaginatedResult,
} from '../../../domain/shared/model/paginated-result.model';
import {
  HadithCollectionFilters,
  HadithItemFilters,
  HadithPersistencePort,
} from '../../../domain/hadith/ports/hadith-persistence.port';
import { HadithCollectionTypeormEntity } from '../entities/hadith-collection.typeorm-entity';
import { HadithItemTypeormEntity } from '../entities/hadith-item.typeorm-entity';

@Injectable()
export class HadithTypeormAdapter implements HadithPersistencePort {
  private readonly collections: Repository<HadithCollectionTypeormEntity>;
  private readonly items: Repository<HadithItemTypeormEntity>;

  constructor(dataSource: DataSource) {
    this.collections = dataSource.getRepository(HadithCollectionTypeormEntity);
    this.items = dataSource.getRepository(HadithItemTypeormEntity);
  }

  async listCollections(filters: HadithCollectionFilters, activeOnly = false) {
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

  async createCollection(data: Partial<HadithCollectionTypeormEntity>) {
    try {
      return await this.collections.save(this.collections.create(data));
    } catch (error) {
      this.rethrowUnique(error, 'Hadith collection key already exists');
      throw error;
    }
  }

  async updateCollection(
    id: string,
    data: Partial<HadithCollectionTypeormEntity>,
  ) {
    const existing = await this.collections.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Hadith collection not found');

    try {
      return await this.collections.save({
        ...existing,
        ...this.stripUndefined(data),
      });
    } catch (error) {
      this.rethrowUnique(error, 'Hadith collection key already exists');
      throw error;
    }
  }

  async deleteCollection(id: string) {
    try {
      await this.collections.delete(id);
    } catch (error) {
      if (this.databaseErrorCode(error) === '23503') {
        throw new ConflictException(
          'Cannot delete a Hadith collection that contains items',
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
    filters: HadithItemFilters,
  ): Promise<PaginatedResult<HadithItemModel>> {
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
        '(item.arabic ILIKE :search OR item.english ILIKE :search OR item.french ILIKE :search OR item.narrator ILIKE :search OR item.chapter ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }
    if (filters.grade) {
      query.andWhere('item.grade ILIKE :grade', { grade: filters.grade });
    }
    if (filters.hadithNumber !== undefined) {
      query.andWhere('item.hadithNumber = :hadithNumber', {
        hadithNumber: filters.hadithNumber,
      });
    }

    const [items, total] = await query
      .orderBy('item.hadithNumber', 'ASC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return this.paginate(items, page, limit, total);
  }

  async listPublicItems(
    collectionId: string,
    filters: HadithItemFilters,
  ): Promise<PublicPaginatedResult<HadithPublicListItemModel>> {
    const { page, limit, skip } = this.pagination(filters);
    const query = this.items
      .createQueryBuilder('item')
      .select('item.hadithNumber', 'hadithNumber')
      .addSelect('item.grade', 'grade')
      .addSelect('item.narrator', 'narrator')
      .addSelect('item.chapter', 'chapter')
      .addSelect('item.sourceReference', 'sourceReference')
      .where('item.collectionId = :collectionId', { collectionId })
      .andWhere('item.isActive = true');

    if (filters.search) {
      query.andWhere(
        '(item.arabic ILIKE :search OR item.english ILIKE :search OR item.french ILIKE :search OR item.narrator ILIKE :search OR item.chapter ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }
    if (filters.grade) {
      query.andWhere('item.grade ILIKE :grade', { grade: filters.grade });
    }
    if (filters.hadithNumber !== undefined) {
      query.andWhere('item.hadithNumber = :hadithNumber', {
        hadithNumber: filters.hadithNumber,
      });
    }

    const rows = await query
      .orderBy('item.hadithNumber', 'ASC')
      .skip(skip)
      .take(limit + 1)
      .getRawMany<HadithPublicListItemModel>();

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

  findItemByNumber(
    collectionId: string,
    hadithNumber: number,
    activeOnly = false,
  ) {
    return this.items.findOne({
      where: activeOnly
        ? { collectionId, hadithNumber, isActive: true }
        : { collectionId, hadithNumber },
    });
  }

  async createItem(data: Partial<HadithItemTypeormEntity>) {
    try {
      return await this.items.save(this.items.create(data));
    } catch (error) {
      this.rethrowUnique(
        error,
        'Hadith number already exists in this collection',
      );
      throw error;
    }
  }

  async updateItem(id: string, data: Partial<HadithItemTypeormEntity>) {
    const existing = await this.items.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Hadith item not found');

    try {
      return await this.items.save({
        ...existing,
        ...this.stripUndefined(data),
      });
    } catch (error) {
      this.rethrowUnique(
        error,
        'Hadith number already exists in this collection',
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
      'collection.totalHadiths',
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
