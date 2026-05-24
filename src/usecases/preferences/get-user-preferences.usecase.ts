import { UserPreferencesPersistencePort } from '../../domain/users/ports/user-preferences-persistence.port';
export class GetUserPreferencesUsecase { constructor(private readonly preferences: UserPreferencesPersistencePort) {} async execute(userId: string) { return (await this.preferences.findByUserId(userId)) ?? this.preferences.create({ userId, language: 'fr' }); } }
