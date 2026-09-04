import { HasanatSourceType } from '../enums/hasanat-source-type.enum';

export const HASANAT_ACTION_RULES = {
  PRAYER_ON_TIME_FARD: {
    key: 'PRAYER_ON_TIME_FARD',
    sourceType: HasanatSourceType.PRAYER,
    points: 20,
    description: 'Obligatory prayer completed on time',
    isActive: true,
  },
  PRAYER_LATE_FARD: {
    key: 'PRAYER_LATE_FARD',
    sourceType: HasanatSourceType.PRAYER,
    points: 10,
    description: 'Obligatory prayer completed late',
    isActive: true,
  },
  SUPEREROGATORY_PRAYER_RAKAH: {
    key: 'SUPEREROGATORY_PRAYER_RAKAH',
    sourceType: HasanatSourceType.PRAYER,
    points: 5,
    description: "Supererogatory prayer per rak'ah",
    isActive: true,
  },
  QURAN_PAGE: {
    key: 'QURAN_PAGE',
    sourceType: HasanatSourceType.QURAN_READING,
    points: 15,
    description: 'Quran reading per page',
    isActive: true,
  },
  QURAN_HIZB: {
    key: 'QURAN_HIZB',
    sourceType: HasanatSourceType.QURAN_READING,
    points: 15,
    description: 'Quran reading per hizb',
    isActive: true,
  },
  MORNING_ADHKAR_COMPLETED: {
    key: 'MORNING_ADHKAR_COMPLETED',
    sourceType: HasanatSourceType.DHIKR,
    points: 50,
    description: 'Morning adhkar completed',
    isActive: true,
  },
  EVENING_ADHKAR_COMPLETED: {
    key: 'EVENING_ADHKAR_COMPLETED',
    sourceType: HasanatSourceType.DHIKR,
    points: 50,
    description: 'Evening adhkar completed',
    isActive: true,
  },
  FASTING_COMPLETED: {
    key: 'FASTING_COMPLETED',
    sourceType: HasanatSourceType.FASTING,
    points: 200,
    description: 'Validated fasting day completed',
    isActive: true,
  },
  CHARITY_ACTION_COMPLETED: {
    key: 'CHARITY_ACTION_COMPLETED',
    sourceType: HasanatSourceType.CHARITY,
    points: 300,
    description: 'Solidarity or social activity completed',
    isActive: true,
  },
} as const;

export function calculateObligatoryPrayerPoints(wasOnTime: boolean) {
  return wasOnTime
    ? HASANAT_ACTION_RULES.PRAYER_ON_TIME_FARD.points
    : HASANAT_ACTION_RULES.PRAYER_LATE_FARD.points;
}

export function calculateSupererogatoryPrayerPoints(rakaat: unknown) {
  const count = toNonNegativeNumber(rakaat);
  return (
    Math.floor(count) * HASANAT_ACTION_RULES.SUPEREROGATORY_PRAYER_RAKAH.points
  );
}

export function calculateQuranReadingPoints(input: {
  pagesCount?: unknown;
  hizbCount?: unknown;
}) {
  const pages = toNonNegativeNumber(input.pagesCount);
  const hizb = toNonNegativeNumber(input.hizbCount);

  // A reading can be represented by both page and hizb totals. Prefer pages
  // when present so the same reading is never rewarded twice.
  const points =
    pages > 0
      ? pages * HASANAT_ACTION_RULES.QURAN_PAGE.points
      : hizb * HASANAT_ACTION_RULES.QURAN_HIZB.points;
  return Math.round(points);
}

function toNonNegativeNumber(value: unknown) {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? Math.max(0, number) : 0;
}
