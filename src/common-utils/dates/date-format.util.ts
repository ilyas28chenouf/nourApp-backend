import { BadRequestException } from '@nestjs/common';

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(value: Date): boolean {
  return Number.isFinite(value.getTime());
}

function parseDateTime(value: unknown): Date | null {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return new Date(value);
  }

  return null;
}

export function toIsoDate(value: Date | string | null | undefined): string {
  const dateOnly = toSafeDateOnly(value);
  if (!dateOnly) {
    throw new BadRequestException('Invalid date value');
  }
  return dateOnly;
}

export function toSafeDateOnly(value: unknown): string | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (value instanceof Date) {
    return isValidDate(value) ? value.toISOString().slice(0, 10) : null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!DATE_ONLY_PATTERN.test(trimmed)) {
    return null;
  }

  const parsed = new Date(`${trimmed}T00:00:00.000Z`);
  if (!isValidDate(parsed)) {
    return null;
  }

  return parsed.toISOString().slice(0, 10) === trimmed ? trimmed : null;
}

export function requireDateOnly(value: unknown, fieldName: string): string {
  const dateOnly = toSafeDateOnly(value);
  if (!dateOnly) {
    throw new BadRequestException(
      `${fieldName} must be a valid YYYY-MM-DD date`,
    );
  }
  return dateOnly;
}

export function optionalDateOnly(
  value: unknown,
  fieldName: string,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  return requireDateOnly(value, fieldName);
}

export function optionalNullableDateTime(
  value: unknown,
  fieldName: string,
): Date | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  const parsed = parseDateTime(value);
  if (!parsed || !isValidDate(parsed)) {
    throw new BadRequestException(`${fieldName} must be a valid ISO date-time`);
  }

  return parsed;
}

export function toSafeIsoDateTime(value: unknown): string | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = parseDateTime(value);
  return parsed && isValidDate(parsed) ? parsed.toISOString() : null;
}

export function previousDateOnly(value: unknown): string | null {
  const dateOnly = toSafeDateOnly(value);
  if (!dateOnly) {
    return null;
  }

  const date = new Date(`${dateOnly}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return toSafeDateOnly(date);
}

export function todayDateOnly(): string {
  return new Date().toISOString().slice(0, 10);
}

export function diffDateOnlyInDays(to: string, from: string): number {
  const toDate = parseDateOnlyToUtcDate(to);
  const fromDate = parseDateOnlyToUtcDate(from);
  return Math.round((toDate.getTime() - fromDate.getTime()) / 86400000);
}

export function isDateOnlyInRange(
  date: string,
  startDate: string,
  endDate?: string | null,
): boolean {
  return date >= startDate && (!endDate || date <= endDate);
}

export function eachDateOnlyBetween(from: string, to: string): string[] {
  const dates: string[] = [];
  const current = parseDateOnlyToUtcDate(from);
  const end = parseDateOnlyToUtcDate(to);

  while (current.getTime() <= end.getTime()) {
    dates.push(current.toISOString().slice(0, 10));
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return dates;
}

function parseDateOnlyToUtcDate(value: string): Date {
  const dateOnly = requireDateOnly(value, 'date');
  const [year, month, day] = dateOnly.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}
