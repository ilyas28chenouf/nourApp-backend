import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LearningPersistencePort } from '../../../domain/learning/ports/learning-persistence.port';
import { LearningItemTypeormEntity } from '../entities/learning-item.typeorm-entity';
import { UserLearningProgressTypeormEntity } from '../entities/user-learning-progress.typeorm-entity';
@Injectable() export class LearningTypeormAdapter implements LearningPersistencePort {
  private readonly items: Repository<LearningItemTypeormEntity>; private readonly progress: Repository<UserLearningProgressTypeormEntity>; constructor(dataSource: DataSource) { this.items = dataSource.getRepository(LearningItemTypeormEntity); this.progress = dataSource.getRepository(UserLearningProgressTypeormEntity); }
  findItems() { return this.items.find({ where: { isActive: true }, order: { createdAt: 'DESC' } }) as any; } findItemById(id: string) { return this.items.findOne({ where: { id } }) as any; } findProgressByUserId(userId: string) { return this.progress.find({ where: { userId }, order: { createdAt: 'DESC' } }); } findProgressById(id: string) { return this.progress.findOne({ where: { id } }); } createProgress(data: any) { return this.progress.save(this.progress.create(data) as any) as any; } async updateProgress(id: string, data: any) { const existing = await this.progress.findOne({ where: { id } }); if (!existing) throw new NotFoundException('Learning progress not found'); return this.progress.save({ ...existing, ...data }); }
}
