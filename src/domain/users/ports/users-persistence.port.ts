import type { UserModel } from '../model/user.model';
export const USERS_PERSISTENCE_PORT = Symbol('USERS_PERSISTENCE_PORT');
export interface UsersPersistencePort { findById(id: string): Promise<UserModel | null>; findByFirebaseUid(firebaseUid: string): Promise<UserModel | null>; findAll(): Promise<UserModel[]>; create(data: Partial<UserModel>): Promise<UserModel>; update(id: string, data: Partial<UserModel>): Promise<UserModel>; }
