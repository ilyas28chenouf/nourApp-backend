import { SpiritualLevel } from '../enums/spiritual-level.enum';

export const SPIRITUAL_LEVEL_POINTS = 1_000;
export const SPIRITUAL_TITLES_PER_CATEGORY = 15;
export const SPIRITUAL_CATEGORY_POINTS =
  SPIRITUAL_LEVEL_POINTS * SPIRITUAL_TITLES_PER_CATEGORY;
export const SPIRITUAL_PROGRESSION_COMPLETION_POINTS = 150_000;

export interface SpiritualCategoryDefinition {
  readonly order: number;
  readonly key: string;
  readonly label: string;
}

export interface SpiritualTitleDefinition {
  readonly order: number;
  readonly key: string;
  readonly arabic: string;
  readonly french: string;
}

export interface SpiritualLevelDefinition {
  readonly level: SpiritualLevel;
  readonly order: number;
  readonly categoryOrder: number;
  readonly categoryLabel: string;
  readonly titleOrder: number;
  readonly titleArabic: string;
  readonly titleFrench: string;
  readonly label: string;
  readonly minPoints: number;
  readonly maxPoints: number;
}

export const SPIRITUAL_CATEGORIES: readonly SpiritualCategoryDefinition[] =
  Object.freeze([
    { order: 1, key: 'eveil', label: "L'Éveil" },
    { order: 2, key: 'discipline', label: 'La Discipline' },
    { order: 3, key: 'constance', label: 'La Constance' },
    { order: 4, key: 'recueillement', label: 'Le Recueillement' },
    { order: 5, key: 'devotion', label: 'La Dévotion' },
    { order: 6, key: 'devouement', label: 'Le Dévouement' },
    { order: 7, key: 'lumiere-d-allah', label: "La Lumière d'Allah" },
    { order: 8, key: 'intimite-avec-allah', label: "L'Intimité avec Allah" },
    { order: 9, key: 'proximite-d-allah', label: "La Proximité d'Allah" },
    { order: 10, key: 'amour-d-allah', label: "L'Amour d'Allah" },
  ]);

export const SPIRITUAL_TITLES: readonly SpiritualTitleDefinition[] =
  Object.freeze([
    {
      order: 1,
      key: 'serviteur-d-allah',
      arabic: 'عَبْدُ اللَّهِ',
      french: "Serviteur d'Allah",
    },
    {
      order: 2,
      key: 'croyant',
      arabic: 'مُؤْمِنٌ',
      french: 'Croyant',
    },
    {
      order: 3,
      key: 'droit',
      arabic: 'مُسْتَقِيمٌ',
      french: 'Droit',
    },
    {
      order: 4,
      key: 'reconnaissant',
      arabic: 'شَاكِرٌ',
      french: 'Reconnaissant',
    },
    {
      order: 5,
      key: 'constamment-obeissant',
      arabic: 'قَانِتٌ',
      french: 'Constamment obéissant',
    },
    {
      order: 6,
      key: 'detache-des-biens-de-ce-monde',
      arabic: 'زَاهِدٌ',
      french: 'Détaché des biens de ce monde',
    },
    {
      order: 7,
      key: 'pieux',
      arabic: 'مُتَّقٍ',
      french: 'Pieux',
    },
    {
      order: 8,
      key: 'satisfait-du-decret-d-allah',
      arabic: 'رَاضٍ',
      french: "Satisfait du décret d'Allah",
    },
    {
      order: 9,
      key: 'clairvoyant',
      arabic: 'بَصِيرٌ',
      french: 'Clairvoyant',
    },
    {
      order: 10,
      key: 'doue-de-certitude',
      arabic: 'مُوقِنٌ',
      french: 'Doué de certitude',
    },
    {
      order: 11,
      key: 'celui-qui-place-sa-confiance-en-allah',
      arabic: 'مُتَوَكِّلٌ',
      french: 'Celui qui place sa confiance en Allah',
    },
    {
      order: 12,
      key: 'bienfaisant',
      arabic: 'مُحْسِنٌ',
      french: 'Bienfaisant',
    },
    {
      order: 13,
      key: 'veridique',
      arabic: 'صِدِّيقٌ',
      french: 'Véridique',
    },
    {
      order: 14,
      key: 'allie-d-allah',
      arabic: 'وَلِيُّ اللَّهِ',
      french: "Allié d'Allah",
    },
    {
      order: 15,
      key: 'victorieux',
      arabic: 'فَائِزٌ',
      french: 'Victorieux',
    },
  ]);

const orderedLevels = Object.values(SpiritualLevel);

if (
  orderedLevels.length !==
  SPIRITUAL_CATEGORIES.length * SPIRITUAL_TITLES.length
) {
  throw new Error('SpiritualLevel enum and catalog metadata are out of sync');
}

export const SPIRITUAL_LEVEL_CATALOG: readonly SpiritualLevelDefinition[] =
  Object.freeze(
    orderedLevels.map((level, index) => {
      const category = SPIRITUAL_CATEGORIES[Math.floor(index / 15)];
      const title = SPIRITUAL_TITLES[index % 15];
      const minPoints = index * SPIRITUAL_LEVEL_POINTS;

      return Object.freeze({
        level,
        order: index + 1,
        categoryOrder: category.order,
        categoryLabel: category.label,
        titleOrder: title.order,
        titleArabic: title.arabic,
        titleFrench: title.french,
        label: `${category.label} - ${title.french}`,
        minPoints,
        maxPoints: minPoints + SPIRITUAL_LEVEL_POINTS - 1,
      });
    }),
  );

const definitionsByLevel = new Map(
  SPIRITUAL_LEVEL_CATALOG.map((definition) => [definition.level, definition]),
);

export function resolveSpiritualLevel(
  totalPoints: number,
): SpiritualLevelDefinition {
  const effectivePoints = toEffectivePoints(totalPoints);
  const index = Math.min(
    Math.floor(effectivePoints / SPIRITUAL_LEVEL_POINTS),
    SPIRITUAL_LEVEL_CATALOG.length - 1,
  );
  return SPIRITUAL_LEVEL_CATALOG[index];
}

export function getSpiritualLevelDefinition(
  level: SpiritualLevel,
): SpiritualLevelDefinition {
  const definition = definitionsByLevel.get(level);
  if (!definition) {
    throw new Error(`Unknown spiritual level: ${String(level)}`);
  }
  return definition;
}

export function getNextSpiritualLevel(
  level: SpiritualLevel,
): SpiritualLevelDefinition | null {
  const current = getSpiritualLevelDefinition(level);
  return SPIRITUAL_LEVEL_CATALOG[current.order] ?? null;
}

export function getPreviousSpiritualLevel(
  level: SpiritualLevel,
): SpiritualLevelDefinition | null {
  const current = getSpiritualLevelDefinition(level);
  return SPIRITUAL_LEVEL_CATALOG[current.order - 2] ?? null;
}

export interface SpiritualLevelProgress {
  readonly current: SpiritualLevelDefinition;
  readonly next: SpiritualLevelDefinition | null;
  readonly currentPoints: number;
  readonly targetPoints: number;
  readonly pointsToNextLevel: number;
  readonly progressToNextLevelPercent: number;
  readonly isCompleted: boolean;
}

export function calculateSpiritualLevelProgress(
  totalPoints: number,
): SpiritualLevelProgress {
  const effectivePoints = toEffectivePoints(totalPoints);
  const current = resolveSpiritualLevel(effectivePoints);
  const isCompleted =
    effectivePoints >= SPIRITUAL_PROGRESSION_COMPLETION_POINTS;
  const next = isCompleted ? null : getNextSpiritualLevel(current.level);
  const pointsInsideCurrentLevel = isCompleted
    ? SPIRITUAL_LEVEL_POINTS
    : clamp(effectivePoints - current.minPoints, 0, SPIRITUAL_LEVEL_POINTS);
  const pointsToNextLevel = isCompleted
    ? 0
    : Math.max(0, current.minPoints + SPIRITUAL_LEVEL_POINTS - effectivePoints);
  const progressToNextLevelPercent = isCompleted
    ? 100
    : Math.round(
        clamp(
          (pointsInsideCurrentLevel / SPIRITUAL_LEVEL_POINTS) * 100,
          0,
          100,
        ) * 100,
      ) / 100;

  return {
    current,
    next,
    currentPoints: pointsInsideCurrentLevel,
    targetPoints: SPIRITUAL_LEVEL_POINTS,
    pointsToNextLevel,
    progressToNextLevelPercent,
    isCompleted,
  };
}

function toEffectivePoints(totalPoints: number) {
  return Number.isFinite(totalPoints) ? Math.max(0, totalPoints) : 0;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
