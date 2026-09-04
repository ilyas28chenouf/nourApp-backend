import { CharityActionType } from '../../charity/enums/charity-action-type.enum';
import { GoalCategory } from '../enums/goal-category.enum';
import { GOAL_CATALOG } from './goal-catalog';

const EXPECTED_TITLES: Record<GoalCategory, string[]> = {
  [GoalCategory.PRAYER]: [
    '5 prières par jour',
    '2 prières à l’heure par jour',
    'Toutes les prières à l’heure',
    'Sobh à l’heure',
    '1 prière en groupe par jour',
    '1 prière à la mosquée par jour',
    '2 prières à la mosquée par jour',
    '3 prières au minimum à la mosquée par jour',
    'Prière du vendredi à la mosquée',
    'Prières surérogatoires de jour (au minimum 2 unités)',
    'Prières surérogatoires de jour ( entre 2 et 6 unités)',
    'Prières surérogatoires de jour ( plus de 6 unités)',
    'Prières surérogatoires de nuit (au minimum 2 unités)',
    'Prières surérogatoires de nuit ( entre 2 et 6 unités)',
    'Prières surérogatoires de nuit ( plus de 6 unités)',
  ],
  [GoalCategory.QURAN]: [
    'Lecture du Coran chaque matin',
    'Lecture du Coran chaque soir',
    'Lecture du Coran matin et soir',
    'Lecture quotidienne & mémorisation',
    'Lecture sourates recommandées (Kahf, Yassin, Mulk, Waqi’a..)',
    'Mémorisation + Tafsir',
  ],
  [GoalCategory.DHIKR]: [
    'Invocations du matin',
    'Invocations du soir',
    'Invocations du matin et du soir',
    'Dhikr du matin : Tasbih (x100) + Salat sur le Prophète (x100) + Istighfar (x100)',
    'Dhikr du soir : Tasbih (x100) + Salat sur le Prophète (x100) + Istighfar (x100)',
    'Dhikr du matin et du soir',
  ],
  [GoalCategory.FASTING]: [
    'Jeûne du lundi',
    'Jeûne du jeudi',
    'Jeûnes du lundi et du jeudi',
    'Jeûnes des 3 jours lunaires',
    'Jeûnes sunnah (Arafat, Achoura…)',
    'Jeûne de Daoud (1 jour sur 2)',
  ],
  [GoalCategory.ACTIVITY]: [
    'Visite des malades et personnes isolées',
    'Visites familiales',
    'Visites amicales et fraternelles',
    'Maraudes',
    'Collectes',
    'Donations',
    'Éducation',
    'Cours et enseignements',
    'Mentorat',
    'Conférences et veillées',
    'Rappel spirituel',
    'Randonnées et sorties solidaires',
    'Voyages solidaires',
    'Engagement associatif',
    'Engagement communautaire',
  ],
};

describe('GOAL_CATALOG', () => {
  it.each(Object.values(GoalCategory))(
    'contains the exact approved %s titles in order',
    (category) => {
      expect(
        GOAL_CATALOG.filter((item) => item.category === category).map(
          (item) => item.title,
        ),
      ).toEqual(EXPECTED_TITLES[category]);
    },
  );

  it('contains exactly 48 ordered, uniquely identified definitions', () => {
    expect(GOAL_CATALOG).toHaveLength(48);
    expect(
      Object.fromEntries(
        Object.values(GoalCategory).map((category) => [
          category,
          GOAL_CATALOG.filter((item) => item.category === category).length,
        ]),
      ),
    ).toEqual({
      PRAYER: 15,
      QURAN: 6,
      DHIKR: 6,
      FASTING: 6,
      ACTIVITY: 15,
    });
    expect(GOAL_CATALOG.map((item) => item.sortOrder)).toEqual(
      Array.from({ length: 48 }, (_, index) => index + 1),
    );
    expect(new Set(GOAL_CATALOG.map((item) => item.code)).size).toBe(48);
    expect(new Set(GOAL_CATALOG.map((item) => item.sortOrder)).size).toBe(48);
  });

  it('does not populate visual descriptions for predefined goals', () => {
    expect(GOAL_CATALOG.every((item) => item.description === undefined)).toBe(
      true,
    );
  });

  it('preserves the Donations activity compatibility mapping', () => {
    expect(
      GOAL_CATALOG.find((item) => item.code === 'ACTIVITY_SADAQA'),
    ).toEqual(
      expect.objectContaining({
        title: 'Donations',
        actionType: CharityActionType.SADAQA,
      }),
    );
  });
});
