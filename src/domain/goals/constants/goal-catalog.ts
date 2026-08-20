import { CharityActionType } from '../../charity/enums/charity-action-type.enum';
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
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'PRAYER_FAJR_ON_TIME',
    category: GoalCategory.PRAYER,
    title: 'Fajr à l’heure',
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
    title: 'Au moins 3 prières à la mosquée par jour',
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
    title: 'Prière surérogatoire de jour ≥ 2 rakaat',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'PRAYER_ADDITIONAL_DAY_2_6',
    category: GoalCategory.PRAYER,
    title: 'Prière surérogatoire de jour de 2 à 6 rakaat',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'PRAYER_ADDITIONAL_DAY_GT_6',
    category: GoalCategory.PRAYER,
    title: 'Prière surérogatoire de jour de plus de 6 rakaat',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'PRAYER_ADDITIONAL_NIGHT_MIN_2',
    category: GoalCategory.PRAYER,
    title: 'Prière surérogatoire de nuit ≥ 2 rakaat',
    target: 1,
    targetUnit: 'NIGHTS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'PRAYER_ADDITIONAL_NIGHT_2_6',
    category: GoalCategory.PRAYER,
    title: 'Prière surérogatoire de nuit de 2 à 6 rakaat',
    target: 1,
    targetUnit: 'NIGHTS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'PRAYER_ADDITIONAL_NIGHT_GT_6',
    category: GoalCategory.PRAYER,
    title: 'Prière surérogatoire de nuit de plus de 6 rakaat',
    target: 1,
    targetUnit: 'NIGHTS',
    frequency: GoalFrequency.DAILY,
  },

  {
    code: 'QURAN_MORNING',
    category: GoalCategory.QURAN,
    title: 'Coran le matin',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'QURAN_EVENING',
    category: GoalCategory.QURAN,
    title: 'Coran le soir',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'QURAN_MORNING_EVENING',
    category: GoalCategory.QURAN,
    title: 'Coran matin et soir',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'QURAN_DAILY_MEMORIZATION',
    category: GoalCategory.QURAN,
    title: 'Coran quotidien et mémorisation',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'QURAN_RECOMMENDED_SURAHS',
    category: GoalCategory.QURAN,
    title: 'Sourates recommandées',
    description: 'Sourates 1, 2, 18, 36, 56, 67, 112, 113 et 114',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'QURAN_MEMORIZATION_TAFSIR',
    category: GoalCategory.QURAN,
    title: 'Mémorisation et Tafsir',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },

  {
    code: 'DHIKR_MORNING',
    category: GoalCategory.DHIKR,
    title: 'Adhkar du matin',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'DHIKR_EVENING',
    category: GoalCategory.DHIKR,
    title: 'Adhkar du soir',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'DHIKR_MORNING_EVENING',
    category: GoalCategory.DHIKR,
    title: 'Adhkar matin et soir',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'DHIKR_MORNING_TRIPLE_100',
    category: GoalCategory.DHIKR,
    title: 'Tasbih, Salawat et Istighfar du matin × 100',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'DHIKR_EVENING_TRIPLE_100',
    category: GoalCategory.DHIKR,
    title: 'Tasbih, Salawat et Istighfar du soir × 100',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.DAILY,
  },
  {
    code: 'DHIKR_MORNING_EVENING_COMPLETE',
    category: GoalCategory.DHIKR,
    title: 'Dhikr complet matin et soir',
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
    title: 'Jeûne du lundi et du jeudi',
    target: 2,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.WEEKLY,
  },
  {
    code: 'FASTING_WHITE_DAYS',
    category: GoalCategory.FASTING,
    title: 'Jours lunaires 13, 14 et 15',
    target: 3,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.MONTHLY,
  },
  {
    code: 'FASTING_SUNNAH',
    category: GoalCategory.FASTING,
    title: 'Jeûne Sunnah',
    target: 1,
    targetUnit: 'DAYS',
    frequency: GoalFrequency.MONTHLY,
  },
  {
    code: 'FASTING_DAOUD',
    category: GoalCategory.FASTING,
    title: 'Cadence de Daoud',
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

export function findGoalCatalogDefinition(code: string) {
  return GOAL_CATALOG.find((definition) => definition.code === code);
}
