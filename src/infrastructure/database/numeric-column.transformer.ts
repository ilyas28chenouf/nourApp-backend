import type { ValueTransformer } from 'typeorm';

export const numericColumnTransformer: ValueTransformer = {
  to(value: number | null | undefined) {
    return value ?? 0;
  },
  from(value: string | number | null | undefined) {
    const numeric = Number(value ?? 0);
    return Number.isFinite(numeric) ? numeric : 0;
  },
};
