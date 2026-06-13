import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DhikrPersistencePort } from '../../../domain/dhikr/ports/dhikr-persistence.port';
import { DhikrPeriod } from '../../../domain/dhikr/enums/dhikr-period.enum';
import { DhikrCategoryTypeormEntity } from '../entities/dhikr-category.typeorm-entity';
import { DhikrItemTypeormEntity } from '../entities/dhikr-item.typeorm-entity';
import { DhikrLogTypeormEntity } from '../entities/dhikr-log.typeorm-entity';
@Injectable()
export class DhikrTypeormAdapter implements DhikrPersistencePort {
  private readonly itemsRepository: Repository<DhikrItemTypeormEntity>;
  private readonly logsRepository: Repository<DhikrLogTypeormEntity>;
  private readonly categoriesRepository: Repository<DhikrCategoryTypeormEntity>;
  constructor(dataSource: DataSource) {
    this.itemsRepository = dataSource.getRepository(DhikrItemTypeormEntity);
    this.logsRepository = dataSource.getRepository(DhikrLogTypeormEntity);
    this.categoriesRepository = dataSource.getRepository(
      DhikrCategoryTypeormEntity,
    );
  }
  findItems(filters?: { category?: string; period?: DhikrPeriod }) {
    const qb = this.itemsRepository
      .createQueryBuilder('item')
      .leftJoin(
        DhikrCategoryTypeormEntity,
        'category',
        'category.id = item.categoryId',
      )
      .where('item.isActive = true')
      .orderBy('item.sortOrder', 'ASC')
      .addOrderBy('item.createdAt', 'DESC');

    if (filters?.category) {
      qb.andWhere('(item.category = :category OR category.slug = :category)', {
        category: filters.category,
      });
    }
    if (filters?.period) {
      qb.andWhere('category.period = :period', { period: filters.period });
    }
    return qb.getMany();
  }
  findCategories() {
    return this.categoriesRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
  }
  async findItemsByCategorySlug(slug: string) {
    const category = await this.categoriesRepository.findOne({
      where: { slug },
    });
    if (!category) throw new NotFoundException('Dhikr category not found');
    return this.itemsRepository.find({
      where: { isActive: true, categoryId: category.id },
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
  }
  createCategory(data: any) {
    return this.categoriesRepository.save(
      this.categoriesRepository.create(data) as any,
    );
  }
  async updateCategory(id: string, data: any) {
    const existing = await this.categoriesRepository.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Dhikr category not found');
    return this.categoriesRepository.save({
      ...existing,
      ...this.stripUndefined(data),
    });
  }
  async deleteCategory(id: string) {
    const existing = await this.categoriesRepository.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Dhikr category not found');
    await this.categoriesRepository.save({ ...existing, isActive: false });
  }
  createItem(data: any) {
    return this.itemsRepository.save(this.itemsRepository.create(data) as any);
  }
  async updateItem(id: string, data: any) {
    const existing = await this.itemsRepository.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Dhikr item not found');
    return this.itemsRepository.save({
      ...existing,
      ...this.stripUndefined(data),
    });
  }
  async deleteItem(id: string) {
    const existing = await this.itemsRepository.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Dhikr item not found');
    await this.itemsRepository.save({ ...existing, isActive: false });
  }
  findLogsByUserId(userId: string) {
    return this.logsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    }) as any;
  }
  findLogById(id: string) {
    return this.logsRepository.findOne({ where: { id } }) as any;
  }
  createLog(data: any) {
    return this.logsRepository.save(
      this.logsRepository.create(data) as any,
    ) as any;
  }
  async updateLog(id: string, data: any) {
    const existing = await this.logsRepository.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Dhikr log not found');
    return this.logsRepository.save({
      ...existing,
      ...this.stripUndefined(data),
    });
  }

  private stripUndefined(data: Record<string, unknown>) {
    return Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    );
  }
}
