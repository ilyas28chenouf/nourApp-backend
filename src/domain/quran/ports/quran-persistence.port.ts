import { QuranReadingLogModel } from '../model/quran-reading-log.model';
export const QURAN_PERSISTENCE_PORT = Symbol('QURAN_PERSISTENCE_PORT');
export interface QuranPersistencePort {
  findLogsByUserId(userId: string): Promise<QuranReadingLogModel[]>;
  findLogById(id: string): Promise<QuranReadingLogModel | null>;
  createLog(data: Partial<QuranReadingLogModel>): Promise<QuranReadingLogModel>;
  updateLog(
    id: string,
    data: Partial<QuranReadingLogModel>,
  ): Promise<QuranReadingLogModel>;
  findGoalsByUserId(userId: string): Promise<any[]>;
  findGoalById(id: string): Promise<any | null>;
  createGoal(data: any): Promise<any>;
  updateGoal(id: string, data: any): Promise<any>;
  deleteGoal(id: string): Promise<void>;
}
