import { BadRequestException } from '@nestjs/common';
import { DateTime } from 'luxon';
import { optionalDateOnly } from '../../common-utils/dates/date-format.util';
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

export class UpdateFastingLogUsecase {
  constructor(
    private readonly persistence: import('../../domain/fasting/ports/fasting-persistence.port').FastingPersistencePort,
  ) {}
  async execute(
    userId: string,
    id: string,
    data: any,
    timezone?: string | null,
  ) {
    const existing = await this.persistence.findLogById(id);
    if (!existing || existing.userId !== userId)
      throw new Error('Record not found');
    const fastingDate =
      optionalDateOnly(data.fastingDate, 'fastingDate') ?? existing.fastingDate;
    const status = data.status ?? existing.status;
    assertCompletedDateIsNotInTheFuture(fastingDate, status, timezone);
    return this.persistence.updateLog(id, {
      ...data,
      fastingDate: data.fastingDate === undefined ? undefined : fastingDate,
    });
  }
}
