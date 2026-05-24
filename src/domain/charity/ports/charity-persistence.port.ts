import { CharityLogModel } from '../model/charity-log.model';
export const CHARITY_PERSISTENCE_PORT = Symbol('CHARITY_PERSISTENCE_PORT');
export interface CharityPersistencePort { findByUserId(userId: string): Promise<CharityLogModel[]>; findById(id: string): Promise<CharityLogModel | null>; create(data: Partial<CharityLogModel>): Promise<CharityLogModel>; update(id: string, data: Partial<CharityLogModel>): Promise<CharityLogModel>; delete(id: string): Promise<void>; }
