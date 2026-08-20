import { todayDateOnly } from '../../common-utils/dates/date-format.util';
import { ResourceType } from '../../domain/resources/enums/resource-type.enum';
import { ResourceModel } from '../../domain/resources/model/resource.model';
import { ResourcesPersistencePort } from '../../domain/resources/ports/resources-persistence.port';

export class GetDailyResourcesUsecase {
  constructor(private readonly persistence: ResourcesPersistencePort) {}

  async execute(date = todayDateOnly()) {
    const resources = await this.persistence.findActive();
    return {
      date,
      verseOfTheDay: this.select(resources, ResourceType.VERSE, date),
      hadithOfTheDay: this.select(resources, ResourceType.HADITH, date),
      wisdomOfTheDay: this.select(resources, ResourceType.WISDOM, date),
    };
  }

  private select(resources: ResourceModel[], type: ResourceType, date: string) {
    const candidates = resources
      .filter((resource) => resource.type === type)
      .sort((left, right) => left.id.localeCompare(right.id));
    if (candidates.length === 0) return null;
    return candidates[this.hash(`${date}:${type}`) % candidates.length];
  }

  private hash(value: string) {
    let hash = 2166136261;
    for (const character of value) {
      hash ^= character.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }
}
