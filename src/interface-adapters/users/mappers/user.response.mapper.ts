export class UserResponseMapper {
  static toResponse<T>(model: T): T { return model; }
  static toResponseList<T>(models: T[]): T[] { return models; }
}
