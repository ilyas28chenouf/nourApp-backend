import { BadRequestException } from '@nestjs/common';
import { DateTime } from 'luxon';
import { requireDateOnly } from '../../common-utils/dates/date-format.util';
import { FastingStatus } from '../../domain/fasting/enums/fasting-status.enum';

function assertCompletedDateIsNotInTheFuture(
  fastingDate: string,
  status: FastingStatus,
  timezone?: string | null,
) {
  const today =
    DateTime.now()
      .setZone(timezone || 'utc')
      .toISODate() ?? DateTime.utc().toISODate();
  if (status === FastingStatus.FASTED && fastingDate > today) {
    throw new BadRequestException('A future fasting date cannot be completed');
  }
}

export class CreateFastingLogUsecase {
  constructor(
    private readonly persistence: import('../../domain/fasting/ports/fasting-persistence.port').FastingPersistencePort,
  ) {}
  execute(userId: string, data: any, timezone?: string | null) {
    const fastingDate = requireDateOnly(data.fastingDate, 'fastingDate');
    assertCompletedDateIsNotInTheFuture(fastingDate, data.status, timezone);
    return this.persistence.createLog({
      ...data,
      userId,
      fastingDate,
    });
  }
}
