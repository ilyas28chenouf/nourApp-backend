import { UserRole } from '../../../domain/users/enums/user-role.enum';
import { AgeRange } from '../enums/age-range.enum';
export interface UserModel {
  id: string;
  firebaseUid: string;
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  ageRange?: AgeRange | string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
  provider?: string | null;
  role: UserRole;
  language: string;
  timezone?: string | null;
  city?: string | null;
  country?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  isActive: boolean;
  lastLoginAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
