import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ResourcesPersistencePort } from '../../../domain/resources/ports/resources-persistence.port';
import { ResourceTypeormEntity } from '../entities/resource.typeorm-entity';
@Injectable() export class ResourcesTypeormAdapter implements ResourcesPersistencePort {
  private readonly repository: Repository<ResourceTypeormEntity>; constructor(dataSource: DataSource) { this.repository = dataSource.getRepository(ResourceTypeormEntity); }
  findActive() { return this.repository.find({ where: { isActive: true }, order: { createdAt: 'DESC' } }) as any; } findById(id: string) { return this.repository.findOne({ where: { id } }) as any; } create(data: any) { return this.repository.save(this.repository.create(data) as any) as any; } async update(id: string, data: any) { const existing = await this.repository.findOne({ where: { id } }); if (!existing) throw new NotFoundException('Resource not found'); return this.repository.save({ ...existing, ...data }); }
}
