import { FastingLogModel } from '../model/fasting-log.model';
import { FastingRecommendedDayModel } from '../model/fasting-recommended-day.model';
export const FASTING_PERSISTENCE_PORT = Symbol('FASTING_PERSISTENCE_PORT');
export interface FastingPersistencePort {
  findRecommendedDays(month?: string): Promise<FastingRecommendedDayModel[]>;
  findLogsByUserId(userId: string): Promise<FastingLogModel[]>;
  findLogById(id: string): Promise<FastingLogModel | null>;
  createLog(data: Partial<FastingLogModel>): Promise<FastingLogModel>;
  updateLog(
    id: string,
    data: Partial<FastingLogModel>,
  ): Promise<FastingLogModel>;
  deleteLog(id: string): Promise<void>;
}
