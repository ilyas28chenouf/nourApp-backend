import { AsmaAlHusnaModel } from '../../../domain/asma-al-husna/model/asma-al-husna.model';

export class AsmaAlHusnaResponseMapper {
  static toDto(model: AsmaAlHusnaModel) {
    return {
      number: model.number,
      arabicName: model.arabicName,
      transliteration: model.transliteration,
      isActive: model.isActive,
      sortOrder: model.sortOrder,
      translations: model.translations.map((translation) => ({
        language: translation.language,
        translatedName: translation.translatedName,
        meaning: translation.meaning,
        explanation: translation.explanation,
        sourceName: translation.sourceName,
        sourceReference: translation.sourceReference,
      })),
    };
  }

  static toDtoList(models: AsmaAlHusnaModel[]) {
    return models.map((model) => this.toDto(model));
  }
}
