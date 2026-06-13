import {
  toSafeDateOnly,
  toSafeIsoDateTime,
} from '../../../common-utils/dates/date-format.util';

export class QuranResponseMapper {
  static toDto<T>(model: T): T {
    if (Array.isArray(model)) return this.toDtoList(model) as T;
    if (model && typeof model === 'object' && 'readingDate' in model) {
      const log = model as Record<string, unknown>;
      return {
        ...log,
        readingDate: toSafeDateOnly(log.readingDate),
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
