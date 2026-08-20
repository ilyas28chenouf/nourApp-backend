import { BadRequestException } from '@nestjs/common';
import { DateTime } from 'luxon';
import { requireDateOnly, todayDateOnly } from './date-format.util';

export enum CalendarPeriod {
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export interface CalendarRange {
  period: CalendarPeriod;
  from: string;
  to: string;
}

export function resolveCalendarRange(
  period: string | undefined,
  anchor?: string,
): CalendarRange {
  const normalized = String(period || CalendarPeriod.MONTH).toUpperCase();
  if (!Object.values(CalendarPeriod).includes(normalized as CalendarPeriod)) {
    throw new BadRequestException('period must be WEEK, MONTH or YEAR');
  }

  const anchorDate = requireDateOnly(anchor ?? todayDateOnly(), 'anchor');
  const date = DateTime.fromISO(anchorDate, { zone: 'utc' });
  const value = normalized as CalendarPeriod;
  const from =
    value === CalendarPeriod.WEEK
      ? date.startOf('week')
      : value === CalendarPeriod.MONTH
        ? date.startOf('month')
        : date.startOf('year');
  const to =
    value === CalendarPeriod.WEEK
      ? date.endOf('week')
      : value === CalendarPeriod.MONTH
        ? date.endOf('month')
        : date.endOf('year');

  return {
    period: value,
    from: from.toISODate()!,
    to: to.toISODate()!,
  };
}
