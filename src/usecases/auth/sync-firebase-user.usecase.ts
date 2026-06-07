import { DecodedIdToken } from 'firebase-admin/auth';
import { UserRole } from '../../domain/users/enums/user-role.enum';
import type { UserModel } from '../../domain/users/model/user.model';
import { UserPreferencesPersistencePort } from '../../domain/users/ports/user-preferences-persistence.port';
import { UsersPersistencePort } from '../../domain/users/ports/users-persistence.port';
import { AppLoggerService } from '../../infrastructure/logger/app-logger.service';

export class SyncFirebaseUserUsecase {
  constructor(
    private readonly users: UsersPersistencePort,
    private readonly preferences: UserPreferencesPersistencePort,
    private readonly defaultRole: UserRole,
    private readonly logger: AppLoggerService,
    private readonly superadminEmail?: string,
  ) {}

  async execute(firebaseUser: DecodedIdToken): Promise<UserModel> {
    const email = firebaseUser.email?.toLowerCase();
    const role =
      email && email === this.superadminEmail?.toLowerCase()
        ? UserRole.SUPERADMIN
        : this.defaultRole;

    const existingByUid = await this.users.findByFirebaseUid(firebaseUser.uid);
    if (existingByUid) {
      this.logger.log('Firebase sync user found by firebaseUid', {
        userId: existingByUid.id,
        firebaseUid: firebaseUser.uid,
      });
    }

    const existingByEmail =
      !existingByUid && email ? await this.users.findByEmail(email) : null;
    if (existingByEmail) {
      this.logger.log('Firebase sync user found by email', {
        userId: existingByEmail.id,
        email,
      });
    }

    const existing = existingByUid ?? existingByEmail;
    const user = existing
      ? await this.updateExistingUser(existing, firebaseUser, email, role)
      : await this.createUser(firebaseUser, email, role);

    if (!(await this.preferences.findByUserId(user.id))) {
      await this.preferences.create({
        userId: user.id,
        language: user.language ?? 'fr',
        prayerCalculationMethod: 'Algeria',
        prayerMadhab: 'Shafi',
      });
    }
    return user;
  }

  private async updateExistingUser(
    existing: UserModel,
    firebaseUser: DecodedIdToken,
    email: string | undefined,
    role: UserRole,
  ) {
    const updatePayload: Partial<UserModel> = {
      firebaseUid: firebaseUser.uid,
      lastLoginAt: new Date(),
    };

    if (this.hasValue(email)) {
      updatePayload.email = email;
    } else {
      this.logger.log('Skipped null Firebase profile field', {
        field: 'email',
        userId: existing.id,
      });
    }

    if (this.hasValue(firebaseUser.firebase?.sign_in_provider)) {
      updatePayload.provider = firebaseUser.firebase?.sign_in_provider;
    }

    const displayNameParts = this.splitDisplayName(firebaseUser.name);
    if (
      !this.hasValue(existing.firstName) &&
      this.hasValue(displayNameParts.firstName)
    ) {
      updatePayload.firstName = displayNameParts.firstName;
    } else {
      this.logPreservedOrSkipped(
        'firstName',
        existing.firstName,
        displayNameParts.firstName,
        existing.id,
      );
    }

    if (
      !this.hasValue(existing.lastName) &&
      this.hasValue(displayNameParts.lastName)
    ) {
      updatePayload.lastName = displayNameParts.lastName;
    } else {
      this.logPreservedOrSkipped(
        'lastName',
        existing.lastName,
        displayNameParts.lastName,
        existing.id,
      );
    }

    if (
      !this.hasValue(existing.avatarUrl) &&
      this.hasValue(firebaseUser.picture)
    ) {
      updatePayload.avatarUrl = firebaseUser.picture;
    } else {
      this.logPreservedOrSkipped(
        'avatarUrl',
        existing.avatarUrl,
        firebaseUser.picture,
        existing.id,
      );
    }

    if (
      !this.hasValue(existing.phone) &&
      this.hasValue(firebaseUser.phone_number)
    ) {
      updatePayload.phone = firebaseUser.phone_number;
    } else {
      this.logPreservedOrSkipped(
        'phone',
        existing.phone,
        firebaseUser.phone_number,
        existing.id,
      );
    }

    if (role === UserRole.SUPERADMIN && existing.role !== UserRole.SUPERADMIN) {
      updatePayload.role = UserRole.SUPERADMIN;
    }

    this.logger.log('Local profile fields preserved during Firebase sync', {
      userId: existing.id,
      preservedFields: [
        'phone',
        'city',
        'country',
        'timezone',
        'latitude',
        'longitude',
        'ageRange',
      ],
    });

    const updated = await this.users.update(existing.id, updatePayload);
    this.logger.log('User updated from Firebase', {
      userId: updated.id,
      updatedFields: Object.keys(updatePayload),
    });
    return updated;
  }

  private async createUser(
    firebaseUser: DecodedIdToken,
    email: string | undefined,
    role: UserRole,
  ) {
    const displayNameParts = this.splitDisplayName(firebaseUser.name);
    const user = await this.users.create({
      firebaseUid: firebaseUser.uid,
      email,
      firstName: displayNameParts.firstName,
      lastName: displayNameParts.lastName,
      fullName: this.hasValue(firebaseUser.name) ? firebaseUser.name : null,
      avatarUrl: this.hasValue(firebaseUser.picture)
        ? firebaseUser.picture
        : null,
      phone: this.hasValue(firebaseUser.phone_number)
        ? firebaseUser.phone_number
        : null,
      provider: firebaseUser.firebase?.sign_in_provider,
      lastLoginAt: new Date(),
      role,
      language: 'fr',
      isActive: true,
    });

    this.logger.log('User created from Firebase', {
      userId: user.id,
      firebaseUid: firebaseUser.uid,
      email,
    });
    return user;
  }

  private hasValue(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
  }

  private splitDisplayName(displayName: unknown): {
    firstName: string | null;
    lastName: string | null;
  } {
    if (!this.hasValue(displayName)) {
      return { firstName: null, lastName: null };
    }

    const [firstName, ...rest] = displayName.trim().split(/\s+/);
    return {
      firstName,
      lastName: rest.length ? rest.join(' ') : null,
    };
  }

  private logPreservedOrSkipped(
    field: string,
    localValue: unknown,
    firebaseValue: unknown,
    userId: string,
  ) {
    if (this.hasValue(localValue)) {
      this.logger.log('Local profile field preserved during Firebase sync', {
        userId,
        field,
      });
      return;
    }

    if (!this.hasValue(firebaseValue)) {
      this.logger.log('Skipped null Firebase profile field', {
        userId,
        field,
      });
    }
  }
}
