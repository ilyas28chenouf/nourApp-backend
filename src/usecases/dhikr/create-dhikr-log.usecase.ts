import {
  optionalNullableDateTime,
  requireDateOnly,
} from '../../common-utils/dates/date-format.util';

export class CreateDhikrLogUsecase {
  constructor(
    private readonly persistence: import('../../domain/dhikr/ports/dhikr-persistence.port').DhikrPersistencePort,
  ) {}
  execute(userId: string, data: any) {
    return this.persistence.createLog({
      ...data,
      userId,
      dhikrDate: requireDateOnly(data.dhikrDate, 'dhikrDate'),
      completedAt: optionalNullableDateTime(data.completedAt, 'completedAt'),
    });
  }
}
