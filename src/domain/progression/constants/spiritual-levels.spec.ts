import {
  calculateSpiritualLevelProgress,
  getNextSpiritualLevel,
  getPreviousSpiritualLevel,
  getSpiritualLevelDefinition,
  resolveSpiritualLevel,
  SPIRITUAL_CATEGORIES,
  SPIRITUAL_LEVEL_CATALOG,
  SPIRITUAL_TITLES,
} from './spiritual-levels';
import { SpiritualLevel } from '../enums/spiritual-level.enum';

describe('spiritual level catalog', () => {
  it.each([
    [0, SpiritualLevel.EVEIL_SERVITEUR_D_ALLAH],
    [1_999, SpiritualLevel.EVEIL_SERVITEUR_D_ALLAH],
    [2_000, SpiritualLevel.EVEIL_CROYANT],
    [3_100, SpiritualLevel.EVEIL_CROYANT],
    [28_000, SpiritualLevel.EVEIL_VICTORIEUX],
    [29_999, SpiritualLevel.EVEIL_VICTORIEUX],
    [30_000, SpiritualLevel.DISCIPLINE_SERVITEUR_D_ALLAH],
    [31_100, SpiritualLevel.DISCIPLINE_SERVITEUR_D_ALLAH],
    [32_000, SpiritualLevel.DISCIPLINE_CROYANT],
    [60_000, SpiritualLevel.CONSTANCE_SERVITEUR_D_ALLAH],
    [62_000, SpiritualLevel.CONSTANCE_CROYANT],
    [63_200, SpiritualLevel.CONSTANCE_CROYANT],
    [269_999, SpiritualLevel.PROXIMITE_D_ALLAH_VICTORIEUX],
    [270_000, SpiritualLevel.AMOUR_D_ALLAH_SERVITEUR_D_ALLAH],
    [298_000, SpiritualLevel.AMOUR_D_ALLAH_VICTORIEUX],
    [300_000, SpiritualLevel.AMOUR_D_ALLAH_VICTORIEUX],
    [400_000, SpiritualLevel.AMOUR_D_ALLAH_VICTORIEUX],
  ])('resolves %i points to %s', (points, expected) => {
    expect(resolveSpiritualLevel(points).level).toBe(expected);
  });

  it.each([
    [1_999, 1, 99.95, false],
    [31_100, 900, 55, false],
    [63_200, 800, 60, false],
    [300_000, 0, 100, true],
    [400_000, 0, 100, true],
  ])(
    'calculates progress for %i points',
    (points, pointsToNext, percent, isCompleted) => {
      const progress = calculateSpiritualLevelProgress(points);
      expect(progress.pointsToNextLevel).toBe(pointsToNext);
      expect(progress.progressToNextLevelPercent).toBe(percent);
      expect(progress.isCompleted).toBe(isCompleted);
    },
  );

  it('contains exactly 150 stable, ordered thresholds', () => {
    const enumValues = Object.values(SpiritualLevel);
    const thresholds = SPIRITUAL_LEVEL_CATALOG.map(
      (definition) => definition.minPoints,
    );

    expect(SPIRITUAL_LEVEL_CATALOG).toHaveLength(150);
    expect(new Set(enumValues).size).toBe(150);
    expect(
      enumValues.every((value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)),
    ).toBe(true);
    expect(new Set(thresholds).size).toBe(150);
    expect(thresholds[0]).toBe(0);
    expect(thresholds.at(-1)).toBe(298_000);

    thresholds.slice(1).forEach((threshold, index) => {
      expect(threshold - thresholds[index]).toBe(2_000);
    });

    SPIRITUAL_LEVEL_CATALOG.forEach((definition, index) => {
      const category = SPIRITUAL_CATEGORIES[Math.floor(index / 15)];
      const title = SPIRITUAL_TITLES[index % 15];
      expect(definition.level).toBe(`${category.key}-${title.key}`);
    });
  });

  it('keeps category and title positions as catalog metadata', () => {
    const definition = getSpiritualLevelDefinition(
      SpiritualLevel.DISCIPLINE_SERVITEUR_D_ALLAH,
    );

    expect(definition).toMatchObject({
      order: 16,
      categoryOrder: 2,
      categoryLabel: 'La Discipline',
      titleOrder: 1,
      titleArabic: 'عَبْدُ اللَّهِ',
      titleFrench: "Serviteur d'Allah",
      label: "La Discipline - Serviteur d'Allah",
      minPoints: 30_000,
      maxPoints: 31_999,
    });
    expect(getPreviousSpiritualLevel(definition.level)?.level).toBe(
      SpiritualLevel.EVEIL_VICTORIEUX,
    );
    expect(getNextSpiritualLevel(definition.level)?.level).toBe(
      SpiritualLevel.DISCIPLINE_CROYANT,
    );
    expect(
      getNextSpiritualLevel(SpiritualLevel.AMOUR_D_ALLAH_VICTORIEUX),
    ).toBeNull();
    expect(calculateSpiritualLevelProgress(300_000).next).toBeNull();
  });
});
