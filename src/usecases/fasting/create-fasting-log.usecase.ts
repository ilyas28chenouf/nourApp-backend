import { requireDateOnly } from '../../common-utils/dates/date-format.util';

export class CreateFastingLogUsecase {
  constructor(
    private readonly persistence: import('../../domain/fasting/ports/fasting-persistence.port').FastingPersistencePort,
  ) {}
  execute(userId: string, data: any) {
    return this.persistence.createLog({
      ...data,
      userId,
      fastingDate: requireDateOnly(data.fastingDate, 'fastingDate'),
    });
  }
}
