import { UserPreferenceModel } from '../model/user-preference.model';
export const USER_PREFERENCES_PERSISTENCE_PORT = Symbol('USER_PREFERENCES_PERSISTENCE_PORT');
export interface UserPreferencesPersistencePort { findByUserId(userId: string): Promise<UserPreferenceModel | null>; create(data: Partial<UserPreferenceModel>): Promise<UserPreferenceModel>; update(id: string, data: Partial<UserPreferenceModel>): Promise<UserPreferenceModel>; }
