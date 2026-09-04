import {
  calculateObligatoryPrayerPoints,
  calculateQuranReadingPoints,
  calculateSupererogatoryPrayerPoints,
  HASANAT_ACTION_RULES,
} from './hasanat-action-rules';

describe('approved Hasanat action rules', () => {
  it('scores obligatory prayers without group or mosque stacking', () => {
    expect(calculateObligatoryPrayerPoints(true)).toBe(20);
    expect(calculateObligatoryPrayerPoints(false)).toBe(10);
    expect(
      Array.from({ length: 5 }, () =>
        calculateObligatoryPrayerPoints(true),
      ).reduce((total, points) => total + points, 0),
    ).toBe(100);
  });

  it('scores supererogatory prayers per rakah', () => {
    expect(calculateSupererogatoryPrayerPoints(2)).toBe(10);
    expect(calculateSupererogatoryPrayerPoints(8)).toBe(40);
  });

  it('scores completed fasting, dhikr, Quran, and solidarity activity', () => {
    expect(HASANAT_ACTION_RULES.FASTING_COMPLETED.points).toBe(200);
    expect(HASANAT_ACTION_RULES.MORNING_ADHKAR_COMPLETED.points).toBe(50);
    expect(HASANAT_ACTION_RULES.EVENING_ADHKAR_COMPLETED.points).toBe(50);
    expect(calculateQuranReadingPoints({ pagesCount: 10 })).toBe(150);
    expect(HASANAT_ACTION_RULES.CHARITY_ACTION_COMPLETED.points).toBe(300);
  });

  it('does not double-award Quran units or objective completion', () => {
    expect(
      calculateQuranReadingPoints({
        pagesCount: 10,
        hizbCount: 2,
      }),
    ).toBe(150);
  });
});
