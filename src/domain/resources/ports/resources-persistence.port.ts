import { ResourceModel } from '../model/resource.model';
export const RESOURCES_PERSISTENCE_PORT = Symbol('RESOURCES_PERSISTENCE_PORT');
export interface ResourcesPersistencePort { findActive(): Promise<ResourceModel[]>; findById(id: string): Promise<ResourceModel | null>; create(data: Partial<ResourceModel>): Promise<ResourceModel>; update(id: string, data: Partial<ResourceModel>): Promise<ResourceModel>; }
