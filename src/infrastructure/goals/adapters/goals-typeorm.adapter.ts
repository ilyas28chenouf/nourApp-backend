import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { GoalsPersistencePort } from '../../../domain/goals/ports/goals-persistence.port';
import { GoalProgressTypeormEntity } from '../entities/goal-progress.typeorm-entity';
import { GoalTypeormEntity } from '../entities/goal.typeorm-entity';
@Injectable()
export class GoalsTypeormAdapter implements GoalsPersistencePort {
  private readonly goals: Repository<GoalTypeormEntity>;
  private readonly progress: Repository<GoalProgressTypeormEntity>;
  constructor(dataSource: DataSource) {
    this.goals = dataSource.getRepository(GoalTypeormEntity);
    this.progress = dataSource.getRepository(GoalProgressTypeormEntity);
  }
  findByOwnerUserId(ownerUserId: string) {
    return this.goals.find({
      where: { ownerUserId, isGroupGoal: false },
      order: { createdAt: 'DESC' },
    }) as any;
  }
  findByGroupId(groupId: string) {
    return this.goals.find({
      where: { groupId, isGroupGoal: true },
      order: { createdAt: 'DESC' },
    }) as any;
  }
  findById(id: string) {
    return this.goals.findOne({ where: { id } }) as any;
  }
  create(data: any) {
    return this.goals.save(this.goals.create(data) as any) as any;
  }
  async update(id: string, data: any) {
    const existing = await this.goals.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Goal not found');
    return this.goals.save({ ...existing, ...data });
  }
  createProgress(data: any) {
    return this.progress.save(this.progress.create(data) as any) as any;
  }
  findProgress(goalId: string, userId: string) {
    return this.progress.find({
      where: { goalId, userId },
      order: { progressDate: 'DESC' },
    });
  }
}
