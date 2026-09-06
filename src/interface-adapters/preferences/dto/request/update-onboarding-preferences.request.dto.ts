import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import {
  ACCEPTED_DAILY_AVAILABLE_TIMES,
  NEW_DAILY_AVAILABLE_TIMES,
} from '../../../../domain/preferences/enums/daily-available-time.enum';
import { MainIntention } from '../../../../domain/preferences/enums/main-intention.enum';

export const GLOBAL_PRACTICE_LEVELS = [
  'D\u00e9butant',
  'Je recommence',
  'Irr\u00e9gulier',
  'Certains jours',
  'R\u00e9gulier',
  'La plupart du temps',
  'Intensif',
];

export const PRAYER_PRACTICE_LEVELS = [
  'Aucune',
  'Je veux m\u2019y mettre',
  '1\u20132 / jour',
  '3\u20134 / jour',
  '5 / jour',
  '\u00c0 l\u2019heure',
  'En groupe',
  'Pri\u00e8res sunnah/sur\u00e9rogatoires',
];

export const QURAN_PRACTICE_LEVELS = [
  'Rarement',
  'Je veux reprendre',
  'Quelques pages',
  'Sans r\u00e9gularit\u00e9',
  '1\u20135 pages / jour',
  'R\u00e9gulier',
  'Au moins 1 Hizb par jour',
  'Lecture + M\u00e9morisation',
  'M\u00e9morisation active',
];

export const ACCEPTED_QURAN_PRACTICE_LEVELS = [
  ...QURAN_PRACTICE_LEVELS,
  'Au moins 1 Hizb',
  'M\u00e9morisation + r\u00e9vision',
];

export const DHIKR_PRACTICES = [
  'Adhkar du matin \u2014 Sabah',
  'Adhkar du soir \u2014 Masa\u2019',
  'Tasbih apr\u00e8s la pri\u00e8re \u00d733',
  'Dhikr libre',
  'Dhikr r\u00e9gulier et programm\u00e9',
  'Peu ou pas de dhikr',
  'Je veux d\u00e9velopper cette pratique',
];

export const FASTING_PRACTICE_LEVELS = [
  'Ramadan seul',
  'Parfois lundi / jeudi',
  'De temps en temps',
  'R\u00e9gulier lundi / jeudi',
  'Chaque semaine',
  'Jours lunaires (13, 14, 15)',
  'Autres jours de je\u00fbne Sunnah / sur\u00e9rogatoires (Arafat, Achoura\u2026)',
];

export const SOCIAL_ACTIONS_FREQUENCIES = [
  'Rarement',
  'Pas encore',
  '1 fois / 3 mois',
  'Grandes occasions',
  'Quelques fois / mois',
  'Quand l\u2019opportunit\u00e9 se pr\u00e9sente',
  'Chaque semaine',
  'Selon mes disponibilit\u00e9s',
];

export const REGULARITY_DURATIONS = [
  'Je commence',
  'Moins d\u2019un mois',
  'Quelques mois',
  '1 \u00e0 6 mois',
  'Plus d\u2019un an',
  'Avec des hauts et des bas',
  'Plusieurs ann\u00e9es',
  'Pratique ancr\u00e9e',
];

export const ISLAMIC_KNOWLEDGE_LEVELS = [
  'D\u00e9butant',
  'Je d\u00e9couvre les bases',
  'Interm\u00e9diaire',
  'Avanc\u00e9',
  '\u00c9rudit',
  'Formation islamique',
];

export const LEGACY_MAIN_INTENTIONS = [
  'Assiduit\u00e9 dans les pri\u00e8res',
  'Effectuer les 5 pri\u00e8res par jour',
  'Progresser dans la lecture du Coran',
  'Progresser dans la m\u00e9morisation du Coran',
  'Invocations quotidiennes',
  'Je\u00fbnes r\u00e9guliers',
  'Approfondissement des adorations',
  'Constance dans la pratique',
  '\u00c9quilibre et \u00e9panouissement spirituel',
];

export const MAIN_INTENTIONS = Object.values(MainIntention);
export const ACCEPTED_MAIN_INTENTIONS = [
  ...MAIN_INTENTIONS,
  ...LEGACY_MAIN_INTENTIONS,
];

export class UpdateOnboardingPreferencesRequestDto {
  @ApiPropertyOptional({
    enum: NEW_DAILY_AVAILABLE_TIMES,
    description:
      'New v1.6 selections. Legacy values remain readable and accepted for compatibility.',
  })
  @IsOptional()
  @IsIn(ACCEPTED_DAILY_AVAILABLE_TIMES)
  dailyAvailableTime?: string;

  @ApiPropertyOptional({ enum: GLOBAL_PRACTICE_LEVELS })
  @IsOptional()
  @IsString()
  @IsIn(GLOBAL_PRACTICE_LEVELS)
  globalPracticeLevel?: string;

  @ApiPropertyOptional({
    enum: PRAYER_PRACTICE_LEVELS,
    isArray: true,
    description:
      'Multiple selections; legacy single answers are also accepted.',
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? [value] : value,
  )
  @IsArray()
  @IsString({ each: true })
  @IsIn(PRAYER_PRACTICE_LEVELS, { each: true })
  prayerPracticeLevel?: string[];

  @ApiPropertyOptional({
    enum: QURAN_PRACTICE_LEVELS,
    isArray: true,
    description:
      'Multiple selections; legacy single answers are also accepted.',
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? [value] : value,
  )
  @IsArray()
  @IsString({ each: true })
  @IsIn(ACCEPTED_QURAN_PRACTICE_LEVELS, { each: true })
  quranPracticeLevel?: string[];

  @ApiPropertyOptional({
    enum: DHIKR_PRACTICES,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsIn(DHIKR_PRACTICES, { each: true })
  dhikrPractices?: string[];

  @ApiPropertyOptional({
    enum: FASTING_PRACTICE_LEVELS,
    isArray: true,
    description:
      'Multiple selections; legacy single answers are also accepted.',
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? [value] : value,
  )
  @IsArray()
  @IsString({ each: true })
  @IsIn(FASTING_PRACTICE_LEVELS, { each: true })
  fastingPracticeLevel?: string[];

  @ApiPropertyOptional({ enum: SOCIAL_ACTIONS_FREQUENCIES })
  @IsOptional()
  @IsString()
  @IsIn(SOCIAL_ACTIONS_FREQUENCIES)
  socialActionsFrequency?: string;

  @ApiPropertyOptional({ enum: REGULARITY_DURATIONS })
  @IsOptional()
  @IsString()
  @IsIn(REGULARITY_DURATIONS)
  regularityDuration?: string;

  @ApiPropertyOptional({ enum: ISLAMIC_KNOWLEDGE_LEVELS })
  @IsOptional()
  @IsString()
  @IsIn(ISLAMIC_KNOWLEDGE_LEVELS)
  islamicKnowledgeLevel?: string;

  @ApiPropertyOptional({ enum: MAIN_INTENTIONS, isArray: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsIn(ACCEPTED_MAIN_INTENTIONS, { each: true })
  mainIntentions?: string[];

  @ApiPropertyOptional({
    enum: MAIN_INTENTIONS,
    isArray: true,
    deprecated: true,
    description: 'Legacy key; scalar and array payloads remain accepted.',
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsString({ each: true })
  @IsIn(ACCEPTED_MAIN_INTENTIONS, { each: true })
  mainIntention?: string[];
}
