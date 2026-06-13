import { requireDateOnly } from '../../common-utils/dates/date-format.util';

export class CreateQuranReadingLogUsecase {
  constructor(
    private readonly persistence: import('../../domain/quran/ports/quran-persistence.port').QuranPersistencePort,
  ) {}
  execute(userId: string, data: any) {
    return this.persistence.createLog({
      ...data,
      userId,
      readingDate: requireDateOnly(data.readingDate, 'readingDate'),
    });
  }
}
