export class FastingResponseMapper {
  static toDto<T>(model: T): T {
    return model;
  }

  static toDtoList<T>(models: T[]): T[] {
    return models.map((model) => this.toDto(model));
  }
}
