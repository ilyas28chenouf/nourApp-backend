import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DhikrPersistencePort } from '../../../domain/dhikr/ports/dhikr-persistence.port';
import { DhikrItemTypeormEntity } from '../entities/dhikr-item.typeorm-entity';
import { DhikrLogTypeormEntity } from '../entities/dhikr-log.typeorm-entity';
@Injectable() export class DhikrTypeormAdapter implements DhikrPersistencePort {
  private readonly itemsRepository: Repository<DhikrItemTypeormEntity>; private readonly logsRepository: Repository<DhikrLogTypeormEntity>;
  constructor(dataSource: DataSource) { this.itemsRepository = dataSource.getRepository(DhikrItemTypeormEntity); this.logsRepository = dataSource.getRepository(DhikrLogTypeormEntity); }
  findItems() { return this.itemsRepository.find({ where: { isActive: true }, order: { createdAt: 'DESC' } }); } findLogsByUserId(userId: string) { return this.logsRepository.find({ where: { userId }, order: { createdAt: 'DESC' } }) as any; } findLogById(id: string) { return this.logsRepository.findOne({ where: { id } }) as any; } createLog(data: any) { return this.logsRepository.save(this.logsRepository.create(data) as any) as any; } async updateLog(id: string, data: any) { const existing = await this.logsRepository.findOne({ where: { id } }); if (!existing) throw new NotFoundException('Dhikr log not found'); return this.logsRepository.save({ ...existing, ...data }); }
}
