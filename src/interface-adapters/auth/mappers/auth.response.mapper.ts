import { UserModel } from '../../../domain/users/model/user.model';

export class AuthResponseMapper {
  static toDto(model: UserModel) {
    return {
      id: model.id,
      firebaseUid: model.firebaseUid,
      email: model.email,
      firstName: model.firstName,
      lastName: model.lastName,
      role: model.role,
      language: model.language,
      ageRange: model.ageRange,
      isActive: model.isActive,
      lastLoginAt: model.lastLoginAt,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  static toDtoList(models: UserModel[]) {
    return models.map((model) => this.toDto(model));
  }
}
