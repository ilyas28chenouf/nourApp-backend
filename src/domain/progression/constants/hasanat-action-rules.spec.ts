import {
  calculateObligatoryPrayerPoints,
  calculateQuranReadingPoints,
  calculateSupererogatoryPrayerPoints,
  HASANAT_ACTION_RULES,
} from './hasanat-action-rules';

describe('approved Hasanat action rules', () => {
  it('scores obligatory prayers without group or mosque stacking', () => {
    expect(calculateObligatoryPrayerPoints(true)).toBe(2);
    expect(calculateObligatoryPrayerPoints(false)).toBe(1);
    expect(
      Array.from({ length: 5 }, () =>
        calculateObligatoryPrayerPoints(true),
      ).reduce((total, points) => total + points, 0),
    ).toBe(10);
  });

  it('scores supererogatory prayers per rakah', () => {
    expect(calculateSupererogatoryPrayerPoints(2)).toBe(1);
    expect(calculateSupererogatoryPrayerPoints(8)).toBe(4);
  });

  it('scores completed fasting, dhikr, Quran, and solidarity activity', () => {
    expect(HASANAT_ACTION_RULES.FASTING_COMPLETED.points).toBe(20);
    expect(HASANAT_ACTION_RULES.MORNING_ADHKAR_COMPLETED.points).toBe(5);
    expect(HASANAT_ACTION_RULES.EVENING_ADHKAR_COMPLETED.points).toBe(5);
    expect(calculateQuranReadingPoints({ pagesCount: 10 })).toBe(15);
    expect(HASANAT_ACTION_RULES.CHARITY_ACTION_COMPLETED.points).toBe(30);
  });

  it('does not double-award Quran units or objective completion', () => {
    expect(
      calculateQuranReadingPoints({
        pagesCount: 10,
        hizbCount: 2,
      }),
    ).toBe(15);
  });
});
