import { LearningItemModel } from '../model/learning-item.model';
export const LEARNING_PERSISTENCE_PORT = Symbol('LEARNING_PERSISTENCE_PORT');
export interface LearningPersistencePort { findItems(): Promise<LearningItemModel[]>; findItemById(id: string): Promise<LearningItemModel | null>; findProgressByUserId(userId: string): Promise<any[]>; findProgressById(id: string): Promise<any | null>; createProgress(data: any): Promise<any>; updateProgress(id: string, data: any): Promise<any>; }
