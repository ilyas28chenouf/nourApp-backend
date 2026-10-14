import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PrayerMadhab } from '../../../../domain/users/enums/prayer-madhab.enum';
import { UpdatePreferencesRequestDto } from './update-preferences.request.dto';

describe('UpdatePreferencesRequestDto prayerMadhab', () => {
  it.each(Object.values(PrayerMadhab))('accepts %s', async (prayerMadhab) => {
    const dto = plainToInstance(UpdatePreferencesRequestDto, { prayerMadhab });
    await expect(validate(dto)).resolves.toHaveLength(0);
  });

  it('rejects unsupported provider and display values', async () => {
    for (const prayerMadhab of ["Shafi'i", 'Standard', 'unsupported']) {
      const dto = plainToInstance(UpdatePreferencesRequestDto, {
        prayerMadhab,
      });
      const errors = await validate(dto);
      expect(errors.some((error) => error.property === 'prayerMadhab')).toBe(
        true,
      );
    }
  });
});
