import { Request } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';
import type { UserModel } from '../../../domain/users/model/user.model';

export interface AuthenticatedRequest extends Request {
  firebaseUser: DecodedIdToken;
  user: UserModel;
}
