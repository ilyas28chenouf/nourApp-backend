import { optionalDateOnly } from '../../common-utils/dates/date-format.util';

export class UpdateQuranReadingLogUsecase {
  constructor(
    private readonly persistence: import('../../domain/quran/ports/quran-persistence.port').QuranPersistencePort,
  ) {}
  async execute(userId: string, id: string, data: any) {
    const existing = await this.persistence.findLogById(id);
    if (!existing || existing.userId !== userId)
      throw new Error('Record not found');
    return this.persistence.updateLog(id, {
      ...data,
      readingDate: optionalDateOnly(data.readingDate, 'readingDate'),
    });
  }
}
