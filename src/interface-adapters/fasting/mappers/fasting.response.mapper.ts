import {
  toSafeDateOnly,
  toSafeIsoDateTime,
} from '../../../common-utils/dates/date-format.util';

export class FastingResponseMapper {
  static toDto<T>(model: T): T {
    if (Array.isArray(model)) return this.toDtoList(model) as T;
    if (model && typeof model === 'object' && 'fastingDate' in model) {
      const log = model as Record<string, unknown>;
      return {
        ...log,
        fastingDate: toSafeDateOnly(log.fastingDate),
        createdAt: toSafeIsoDateTime(log.createdAt),
        updatedAt: toSafeIsoDateTime(log.updatedAt),
      } as T;
    }
    if (model && typeof model === 'object' && 'date' in model) {
      const recommendedDay = model as Record<string, unknown>;
      return {
        ...recommendedDay,
        date: toSafeDateOnly(recommendedDay.date),
        createdAt: toSafeIsoDateTime(recommendedDay.createdAt),
      } as T;
    }
    return model;
  }

  static toDtoList<T>(models: T[]): T[] {
    return models.map((model) => this.toDto(model));
  }
}
