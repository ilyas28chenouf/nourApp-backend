import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { MeditationPersistencePort } from '../../../domain/meditation/ports/meditation-persistence.port';
import { MeditationLogTypeormEntity } from '../entities/meditation-log.typeorm-entity';

@Injectable()
export class MeditationTypeormAdapter implements MeditationPersistencePort {
  private readonly repository: Repository<MeditationLogTypeormEntity>;
  constructor(dataSource: DataSource) { this.repository = dataSource.getRepository(MeditationLogTypeormEntity); }
  findByUserId(userId: string) { return this.repository.find({ where: { userId }, order: { createdAt: 'DESC' } }) as any; }
  findById(id: string) { return this.repository.findOne({ where: { id } }) as any; }
  create(data: any) { return this.repository.save(this.repository.create(data) as any) as any; }
  async update(id: string, data: any) { const existing = await this.repository.findOne({ where: { id } }); if (!existing) throw new NotFoundException('Meditation log not found'); return this.repository.save({ ...existing, ...data }); }
  async delete(id: string) { await this.repository.delete(id); }
}
