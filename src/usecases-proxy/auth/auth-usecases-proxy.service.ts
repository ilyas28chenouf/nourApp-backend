import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersTypeormAdapter } from '../../infrastructure/users/adapters/users-typeorm.adapter';
import { UserPreferencesTypeormAdapter } from '../../infrastructure/users/adapters/user-preferences-typeorm.adapter';
import { UserRole } from '../../domain/users/enums/user-role.enum';
import { GetCurrentAuthUserUsecase } from '../../usecases/auth/get-current-auth-user.usecase';
import { SyncFirebaseUserUsecase } from '../../usecases/auth/sync-firebase-user.usecase';

@Injectable()
export class AuthUsecasesProxyService {
  private readonly getCurrentAuthUserUsecase = new GetCurrentAuthUserUsecase();

  constructor(
    private readonly users: UsersTypeormAdapter,
    private readonly preferences: UserPreferencesTypeormAdapter,
    private readonly configService: ConfigService,
  ) {}

  syncFirebaseUser(firebaseUser: import('firebase-admin/auth').DecodedIdToken) {
    const defaultRole =
      this.configService.get<UserRole>('DEFAULT_USER_ROLE') ?? UserRole.USER;
    const superadminEmail = this.configService.get<string>('SUPERADMIN_EMAIL');
    return new SyncFirebaseUserUsecase(
      this.users,
      this.preferences,
      defaultRole,
      superadminEmail,
    ).execute(firebaseUser);
  }
  getCurrentUser(user: any) {
    return this.getCurrentAuthUserUsecase.execute(user);
  }
}
