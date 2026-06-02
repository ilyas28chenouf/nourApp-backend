import { MeditationLogModel } from '../model/meditation-log.model';
export const MEDITATION_PERSISTENCE_PORT = Symbol(
  'MEDITATION_PERSISTENCE_PORT',
);
export interface MeditationPersistencePort {
  findByUserId(userId: string): Promise<MeditationLogModel[]>;
  findById(id: string): Promise<MeditationLogModel | null>;
  create(data: Partial<MeditationLogModel>): Promise<MeditationLogModel>;
  update(
    id: string,
    data: Partial<MeditationLogModel>,
  ): Promise<MeditationLogModel>;
  delete(id: string): Promise<void>;
}
