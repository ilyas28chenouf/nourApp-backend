import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateOnboardingPreferencesRequestDto } from './update-onboarding-preferences.request.dto';
import { UpdatePreferencesRequestDto } from './update-preferences.request.dto';

describe.each([
  UpdateOnboardingPreferencesRequestDto,
  UpdatePreferencesRequestDto,
])('%s spiritual practice', (Dto) => {
  it('accepts several answers without losing selections', async () => {
    const payload = {
      prayerPracticeLevel: ['5 / jour', 'À l’heure', 'En groupe'],
      quranPracticeLevel: ['Régulier', 'Mémorisation active'],
      fastingPracticeLevel: ['Chaque semaine', 'Jours lunaires (13, 14, 15)'],
    };
    const dto = plainToInstance(Dto, payload);
    expect(await validate(dto)).toHaveLength(0);
    expect(dto).toMatchObject(payload);
  });

  it('converts legacy scalar answers into arrays', async () => {
    const dto = plainToInstance(Dto, {
      prayerPracticeLevel: '5 / jour',
      quranPracticeLevel: 'Régulier',
      fastingPracticeLevel: 'Ramadan seul',
    });
    expect(await validate(dto)).toHaveLength(0);
    expect(dto.prayerPracticeLevel).toEqual(['5 / jour']);
    expect(dto.quranPracticeLevel).toEqual(['Régulier']);
    expect(dto.fastingPracticeLevel).toEqual(['Ramadan seul']);
  });

  it('rejects invalid selections and arrays for single-choice questions', async () => {
    for (const payload of [
      { prayerPracticeLevel: ['5 / jour', 'invalid'] },
      { quranPracticeLevel: [42] },
      { fastingPracticeLevel: {} },
      { dailyAvailableTime: ['15–30 min', '30–60 min'] },
      { globalPracticeLevel: ['Débutant', 'Intensif'] },
    ]) {
      expect(
        (await validate(plainToInstance(Dto, payload))).length,
      ).toBeGreaterThan(0);
    }
  });
});
