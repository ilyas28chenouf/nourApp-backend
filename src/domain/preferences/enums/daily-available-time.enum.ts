export enum DailyAvailableTime {
  MIN_5_15 = '5\u201315 min',
  MIN_15_30 = '15\u201330 min',
  MIN_30_60 = '30\u201360 min',
  HOUR_PLUS = '+ 1 heure',
  HOUR_1_2 = '1 à 2 heures',
  HOUR_2_PLUS = 'Plus de 2 heures',
}

export const NEW_DAILY_AVAILABLE_TIMES = [
  DailyAvailableTime.MIN_15_30,
  DailyAvailableTime.MIN_30_60,
  DailyAvailableTime.HOUR_1_2,
  DailyAvailableTime.HOUR_2_PLUS,
] as const;

export const ACCEPTED_DAILY_AVAILABLE_TIMES = Object.values(DailyAvailableTime);
