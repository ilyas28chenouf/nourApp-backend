import { GoalModel } from '../model/goal.model';
export const GOALS_PERSISTENCE_PORT = Symbol('GOALS_PERSISTENCE_PORT');
export interface GoalsPersistencePort {
  findByOwnerUserId(userId: string): Promise<GoalModel[]>;
  findByGroupId(groupId: string): Promise<GoalModel[]>;
  findById(id: string): Promise<GoalModel | null>;
  create(data: Partial<GoalModel>): Promise<GoalModel>;
  update(id: string, data: Partial<GoalModel>): Promise<GoalModel>;
  createProgress(data: any): Promise<any>;
  findProgress(goalId: string, userId: string): Promise<any[]>;
}
