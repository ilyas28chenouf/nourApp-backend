import {
  optionalDateOnly,
  optionalNullableDateTime,
} from '../../common-utils/dates/date-format.util';

export class UpdateDhikrLogUsecase {
  constructor(
    private readonly persistence: import('../../domain/dhikr/ports/dhikr-persistence.port').DhikrPersistencePort,
  ) {}
  async execute(userId: string, id: string, data: any) {
    const existing = await this.persistence.findLogById(id);
    if (!existing || existing.userId !== userId)
      throw new Error('Record not found');
    return this.persistence.updateLog(id, {
      ...data,
      dhikrDate: optionalDateOnly(data.dhikrDate, 'dhikrDate'),
      completedAt: optionalNullableDateTime(data.completedAt, 'completedAt'),
    });
  }
}
