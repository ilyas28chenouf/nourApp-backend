import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthUsecasesProxyService } from '../../usecases-proxy/auth/auth-usecases-proxy.service';
import { FirebaseAdminService } from '../../infrastructure/firebase/firebase-admin.service';
import { AuthenticatedRequest } from '../types/authenticated-request.type';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private readonly firebaseAdminService: FirebaseAdminService,
    private readonly authProxy: AuthUsecasesProxyService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;
    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Firebase bearer token');
    }

    const firebaseUser = await this.firebaseAdminService.verifyIdToken(authorization.slice('Bearer '.length).trim());
    const localUser = await this.authProxy.syncFirebaseUser(firebaseUser);
    if (!localUser.isActive) {
      throw new UnauthorizedException('User is inactive');
    }

    request.firebaseUser = firebaseUser;
    request.user = localUser;
    return true;
  }
}
