import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CharityPersistencePort } from '../../../domain/charity/ports/charity-persistence.port';
import { CharityLogTypeormEntity } from '../entities/charity-log.typeorm-entity';

@Injectable()
export class CharityTypeormAdapter implements CharityPersistencePort {
  private readonly repository: Repository<CharityLogTypeormEntity>;
  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(CharityLogTypeormEntity);
  }
  findByUserId(userId: string) {
    return this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    }) as any;
  }
  findById(id: string) {
    return this.repository.findOne({ where: { id } }) as any;
  }
  create(data: any) {
    return this.repository.save(this.repository.create(data) as any) as any;
  }
  async update(id: string, data: any) {
    const existing = await this.repository.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Charity log not found');
    return this.repository.save({ ...existing, ...data });
  }
  async delete(id: string) {
    await this.repository.delete(id);
  }
}
