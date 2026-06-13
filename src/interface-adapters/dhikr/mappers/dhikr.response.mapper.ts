import {
  toSafeDateOnly,
  toSafeIsoDateTime,
} from '../../../common-utils/dates/date-format.util';

export class DhikrResponseMapper {
  static toDto<T>(model: T): T {
    if (Array.isArray(model)) return this.toDtoList(model) as T;
    if (model && typeof model === 'object' && 'dhikrDate' in model) {
      const log = model as Record<string, unknown>;
      return {
        ...log,
        dhikrDate: toSafeDateOnly(log.dhikrDate),
        completedAt: toSafeIsoDateTime(log.completedAt),
        createdAt: toSafeIsoDateTime(log.createdAt),
        updatedAt: toSafeIsoDateTime(log.updatedAt),
      } as T;
    }
    return model;
  }

  static toDtoList<T>(models: T[]): T[] {
    return models.map((model) => this.toDto(model));
  }
}
