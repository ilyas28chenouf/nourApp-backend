import { DhikrLogModel } from '../model/dhikr-log.model';
export const DHIKR_PERSISTENCE_PORT = Symbol('DHIKR_PERSISTENCE_PORT');
export interface DhikrPersistencePort {
  findItems(): Promise<any[]>;
  findLogsByUserId(userId: string): Promise<DhikrLogModel[]>;
  findLogById(id: string): Promise<DhikrLogModel | null>;
  createLog(data: Partial<DhikrLogModel>): Promise<DhikrLogModel>;
  updateLog(id: string, data: Partial<DhikrLogModel>): Promise<DhikrLogModel>;
  deleteLog(id: string): Promise<void>;
}
