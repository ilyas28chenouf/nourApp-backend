import { CharityActionType } from '../../charity/enums/charity-action-type.enum';
import { FastingType } from '../../fasting/enums/fasting-type.enum';
import { GoalCategory } from '../enums/goal-category.enum';
import { GoalFrequency } from '../enums/goal-frequency.enum';

export interface GoalCatalogDefinition {
  code: string;
  category: GoalCategory;
  title: string;
  description?: string;
  target: number;
  targetUnit: string;
  frequency: GoalFrequency;
  sortOrder: number;
  actionType?: CharityActionType;
}

type CatalogInput = Omit<GoalCatalogDefinition, 'sortOrder'>;

const definitions: CatalogInput[] = [
  {
    code: 'PRAYER_FIVE_DAILY',
    category: GoalCategory.PRAYER,
    title: '5 prières par jour',
    target: 5,
    targetUnit: 'PRAYERS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'PRAYER_TWO_ON_TIME_DAILY',
    category: GoalCategory.PRAYER,
    title: '2 prières à l’heure par jour',
    target: 2,
    targetUnit: 'PRAYERS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'PRAYER_ALL_ON_TIME_DAILY',
    category: GoalCategory.PRAYER,
    title: 'Toutes les prières à l’heure',
    target: 5,
    targetUnit: 'PRAYERS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'PRAYER_FAJR_ON_TIME',
    category: GoalCategory.PRAYER,
    title: 'Sobh à l’heure',
    target: 1,
    targetUnit: 'PRAYERS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'PRAYER_GROUP_DAILY',
    category: GoalCategory.PRAYER,
    title: '1 prière en groupe par jour',
    target: 1,
    targetUnit: 'PRAYERS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'PRAYER_MOSQUE_ONE_DAILY',
    category: GoalCategory.PRAYER,
    title: '1 prière à la mosquée par jour',
    target: 1,
    targetUnit: 'PRAYERS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'PRAYER_MOSQUE_TWO_DAILY',
    category: GoalCategory.PRAYER,
    title: '2 prières à la mosquée par jour',
    target: 2,
    targetUnit: 'PRAYERS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'PRAYER_MOSQUE_THREE_DAILY',
    category: GoalCategory.PRAYER,
    title: '3 prières au minimum à la mosquée par jour',
    target: 3,
    targetUnit: 'PRAYERS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'PRAYER_FRIDAY_MOSQUE',
    category: GoalCategory.PRAYER,
    title: 'Prière du vendredi à la mosquée',
    target: 1,
    targetUnit: 'FRIDAYS',
    frequency: GoalFrequency.WEEKLY,
  },
  {
    code: 'PRAYER_ADDITIONAL_DAY_MIN_2',
    category: GoalCategory.PRAYER,
    title: 'Prières surérogatoires de jour (au minimum 2 unités)',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'PRAYER_ADDITIONAL_DAY_2_6',
    category: GoalCategory.PRAYER,
    title: 'Prières surérogatoires de jour ( entre 2 et 6 unités)',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'PRAYER_ADDITIONAL_DAY_GT_6',
    category: GoalCategory.PRAYER,
    title: 'Prières surérogatoires de jour ( plus de 6 unités)',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'PRAYER_ADDITIONAL_NIGHT_MIN_2',
    category: GoalCategory.PRAYER,
    title: 'Prières surérogatoires de nuit (au minimum 2 unités)',
    target: 1,
    targetUnit: 'NIGHTS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'PRAYER_ADDITIONAL_NIGHT_2_6',
    category: GoalCategory.PRAYER,
    title: 'Prières surérogatoires de nuit ( entre 2 et 6 unités)',
    target: 1,
    targetUnit: 'NIGHTS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'PRAYER_ADDITIONAL_NIGHT_GT_6',
    category: GoalCategory.PRAYER,
    title: 'Prières surérogatoires de nuit ( plus de 6 unités)',
    target: 1,
    targetUnit: 'NIGHTS',
    frequency: GoalFrequency.DAILY,
  },

  {
    code: 'QURAN_MORNING',
    category: GoalCategory.QURAN,
    title: 'Lecture du Coran chaque matin',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'QURAN_EVENING',
    category: GoalCategory.QURAN,
    title: 'Lecture du Coran chaque soir',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'QURAN_MORNING_EVENING',
    category: GoalCategory.QURAN,
    title: 'Lecture du Coran matin et soir',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'QURAN_DAILY_MEMORIZATION',
    category: GoalCategory.QURAN,
    title: 'Lecture quotidienne & mémorisation',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'QURAN_RECOMMENDED_SURAHS',
    category: GoalCategory.QURAN,
    title: 'Lecture sourates recommandées (Kahf, Yassin, Mulk, Waqi’a..)',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'QURAN_MEMORIZATION_TAFSIR',
    category: GoalCategory.QURAN,
    title: 'Mémorisation + Tafsir',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },

  {
    code: 'DHIKR_MORNING',
    category: GoalCategory.DHIKR,
    title: 'Invocations du matin',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'DHIKR_EVENING',
    category: GoalCategory.DHIKR,
    title: 'Invocations du soir',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'DHIKR_MORNING_EVENING',
    category: GoalCategory.DHIKR,
    title: 'Invocations du matin et du soir',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'DHIKR_MORNING_TRIPLE_100',
    category: GoalCategory.DHIKR,
    title:
      'Dhikr du matin : Tasbih (x100) + Salat sur le Prophète (x100) + Istighfar (x100)',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'DHIKR_EVENING_TRIPLE_100',
    category: GoalCategory.DHIKR,
    title:
      'Dhikr du soir : Tasbih (x100) + Salat sur le Prophète (x100) + Istighfar (x100)',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'DHIKR_MORNING_EVENING_COMPLETE',
    category: GoalCategory.DHIKR,
    title: 'Dhikr du matin et du soir',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },

  {
    code: 'FASTING_MONDAY',
    category: GoalCategory.FASTING,
    title: 'Jeûne du lundi',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.WEEKLY,
  },
  {
    code: 'FASTING_THURSDAY',
    category: GoalCategory.FASTING,
    title: 'Jeûne du jeudi',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.WEEKLY,
  },
  {
    code: 'FASTING_MONDAY_THURSDAY',
    category: GoalCategory.FASTING,
    title: 'Jeûnes du lundi et du jeudi',
    target: 2,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.WEEKLY,
  },
  {
    code: 'FASTING_WHITE_DAYS',
    category: GoalCategory.FASTING,
    title: 'Jeûnes des 3 jours lunaires',
    target: 3,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.MONTHLY,
  },
  {
    code: 'FASTING_SUNNAH',
    category: GoalCategory.FASTING,
    title: 'Jeûnes sunnah (Arafat, Achoura…)',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.MONTHLY,
  },
  {
    code: 'FASTING_DAOUD',
    category: GoalCategory.FASTING,
    title: 'Jeûne de Daoud (1 jour sur 2)',
    target: 1,
    targetUnit: 'CADENCE',
    frequency: GoalFrequency.DAILY,
  },
];

const activityDefinitions: Array<[CharityActionType, string]> = [
  [
    CharityActionType.SICK_ISOLATED_VISIT,
    'Visite des malades et personnes isolées',
  ],
  [CharityActionType.FAMILY_VISIT, 'Visites familiales'],
  [CharityActionType.FRATERNAL_VISIT, 'Visites amicales et fraternelles'],
  [CharityActionType.MARAUDE, 'Maraudes'],
  [CharityActionType.COLLECTE, 'Collectes'],
  [CharityActionType.SADAQA, 'Donations'],
  [CharityActionType.EDUCATION, 'Éducation'],
  [CharityActionType.TEACHING, 'Cours et enseignements'],
  [CharityActionType.MENTORAT, 'Mentorat'],
  [CharityActionType.CONFERENCE_VIGIL, 'Conférences et veillées'],
  [CharityActionType.SPIRITUAL_REMINDER, 'Rappel spirituel'],
  [CharityActionType.RANDONNEE_SOLIDAIRE, 'Randonnées et sorties solidaires'],
  [CharityActionType.VOYAGE_SOLIDAIRE, 'Voyages solidaires'],
  [CharityActionType.ASSOCIATIVE_ENGAGEMENT, 'Engagement associatif'],
  [CharityActionType.COMMUNITY_ENGAGEMENT, 'Engagement communautaire'],
];

for (const [actionType, title] of activityDefinitions) {
  definitions.push({
    code: `ACTIVITY_${actionType}`,
    category: GoalCategory.ACTIVITY,
    title,
    target: 1,
    targetUnit: 'ACTIVITIES',
    frequency: GoalFrequency.MONTHLY,
    actionType,
  });
}

export const GOAL_CATALOG: readonly GoalCatalogDefinition[] = Object.freeze(
  definitions.map((definition, index) => ({
    ...definition,
    sortOrder: index + 1,
  })),
);

export const RECOMMENDED_SURAH_NUMBERS = Object.freeze([
  1, 2, 18, 36, 56, 67, 112, 113, 114,
]);

export const APPROVED_SUNNAH_FASTING_TYPES: readonly FastingType[] =
  Object.freeze([FastingType.ARAFAH, FastingType.ASHURA]);

export function findGoalCatalogDefinition(code: string) {
  return GOAL_CATALOG.find((definition) => definition.code === code);
}
