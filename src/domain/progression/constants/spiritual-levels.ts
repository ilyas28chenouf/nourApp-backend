import { SpiritualLevel } from '../enums/spiritual-level.enum';

export const SPIRITUAL_LEVEL_THRESHOLDS = [
  { level: SpiritualLevel.MURID, label: 'Murid', minPoints: 0 },
  { level: SpiritualLevel.SALIK, label: 'Salik', minPoints: 500 },
  { level: SpiritualLevel.WARID, label: 'Warid', minPoints: 1500 },
  { level: SpiritualLevel.MUTAWASSIT, label: 'Mutawassit', minPoints: 3000 },
  { level: SpiritualLevel.MUQARRAB, label: 'Muqarrab', minPoints: 6000 },
  { level: SpiritualLevel.ARIF, label: 'Arif', minPoints: 10000 },
] as const;
