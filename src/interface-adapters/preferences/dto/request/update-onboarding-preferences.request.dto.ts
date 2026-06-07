import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { DailyAvailableTime } from '../../../../domain/preferences/enums/daily-available-time.enum';

export const GLOBAL_PRACTICE_LEVELS = [
  'D\u00e9butant',
  'Je recommence',
  'Irr\u00e9gulier',
  'Certains jours',
  'R\u00e9gulier',
  'La plupart du temps',
  'Intensif',
  'Chaque jour, combin\u00e9',
];

export const PRAYER_PRACTICE_LEVELS = [
  'Aucune',
  'Je veux m\u2019y mettre',
  '1\u20132 / jour',
  'Fajr ou quelques-unes',
  '3\u20134 / jour',
  'La majorit\u00e9',
  '5 / jour',
  '\u00c0 l\u2019heure',
  '5 + nuit',
  'Tahajjud, rawatib',
];

export const QURAN_PRACTICE_LEVELS = [
  'Rarement',
  'Je veux reprendre',
  'Quelques pages',
  'Sans r\u00e9gularit\u00e9',
  '1\u20135 pages / jour',
  'Habitude',
  '1 hizb+ / jour',
  'Lecture + hifz',
  'Hifz actif',
  'M\u00e9morisation + r\u00e9vision',
];

export const DHIKR_PRACTICES = [
  'Adhkar du matin \u2014 Sabah',
  'Adhkar du soir \u2014 Masa\u2019',
  'Tasbih apr\u00e8s la pri\u00e8re \u00d733',
  'Dhikr libre',
  'Salawat',
  'Peu ou pas de dhikr',
  'Je veux d\u00e9velopper cette pratique',
];

export const FASTING_PRACTICE_LEVELS = [
  'Ramadan seul',
  'Pas hors Ramadan',
  'Parfois lundi / jeudi',
  'De temps en temps',
  'R\u00e9gulier lundi / jeudi',
  'Chaque semaine',
  'Je\u00fbnes vari\u00e9s',
  'Arafat, Achoura\u2026',
];

export const SOCIAL_ACTIONS_FREQUENCIES = [
  'Rarement',
  'Tr\u00e8s peu ou pas encore',
  '1 fois / 3 mois',
  'Grandes occasions',
  'Quelques fois / mois',
  'Quand l\u2019occasion se pr\u00e9sente',
  'Chaque semaine',
  'Dans mon rythme',
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
  'Piliers, sunnas, hadiths',
  'Avanc\u00e9',
  'Fiqh, tafsir, sira',
  '\u00c9rudit',
  'Formation islamique',
];

export const MAIN_INTENTIONS = [
  'R\u00e9gulariser les pri\u00e8res',
  'Atteindre les 5 pri\u00e8res par jour',
  'Progresser avec le Coran',
  'Lire et m\u00e9moriser',
  'Dhikr quotidien',
  'Structurer les invocations',
  '\u00c9quilibre global',
  'Toutes les pratiques',
  'Amour avec Allah',
  'Renforcer la relation spirituelle',
];

export class UpdateOnboardingPreferencesRequestDto {
  @ApiPropertyOptional({
    enum: DailyAvailableTime,
    description:
      '5\u201315 min: Pri\u00e8re + adhkars; 15\u201330 min: Pri\u00e8re + Coran + dhikr; 30\u201360 min: Programme complet; + 1 heure: Tahajjud, hifz',
  })
  @IsOptional()
  @IsEnum(DailyAvailableTime)
  dailyAvailableTime?: DailyAvailableTime;

  @ApiPropertyOptional({ enum: GLOBAL_PRACTICE_LEVELS })
  @IsOptional()
  @IsString()
  @IsIn(GLOBAL_PRACTICE_LEVELS)
  globalPracticeLevel?: string;

  @ApiPropertyOptional({ enum: PRAYER_PRACTICE_LEVELS })
  @IsOptional()
  @IsString()
  @IsIn(PRAYER_PRACTICE_LEVELS)
  prayerPracticeLevel?: string;

  @ApiPropertyOptional({ enum: QURAN_PRACTICE_LEVELS })
  @IsOptional()
  @IsString()
  @IsIn(QURAN_PRACTICE_LEVELS)
  quranPracticeLevel?: string;

  @ApiPropertyOptional({ enum: DHIKR_PRACTICES, isArray: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsIn(DHIKR_PRACTICES, { each: true })
  dhikrPractices?: string[];

  @ApiPropertyOptional({ enum: FASTING_PRACTICE_LEVELS })
  @IsOptional()
  @IsString()
  @IsIn(FASTING_PRACTICE_LEVELS)
  fastingPracticeLevel?: string;

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

  @ApiPropertyOptional({ enum: MAIN_INTENTIONS })
  @IsOptional()
  @IsString()
  @IsIn(MAIN_INTENTIONS)
  mainIntention?: string;
}
