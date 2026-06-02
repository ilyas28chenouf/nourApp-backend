export class UserPreferencePersistenceMapper {
  static toDomain<T>(entity: T): T {
    return entity;
  }
  static toPersistence<T>(model: Partial<T>): Partial<T> {
    return model;
  }
}
