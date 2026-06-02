import { UserModel } from '../../../domain/users/model/user.model';

export class UserResponseMapper {
  static toDto(model: UserModel) {
    return {
      id: model.id,
      firebaseUid: model.firebaseUid,
      email: model.email,
      phone: model.phone,
      fullName: model.fullName,
      avatarUrl: model.avatarUrl,
      provider: model.provider,
      role: model.role,
      language: model.language,
      timezone: model.timezone,
      city: model.city,
      country: model.country,
      latitude: model.latitude,
      longitude: model.longitude,
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
