import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { App, cert, getApps, initializeApp } from 'firebase-admin/app';
import { Auth, DecodedIdToken, getAuth } from 'firebase-admin/auth';

@Injectable()
export class FirebaseAdminService {
  private readonly app: App;
  private readonly auth: Auth;

  constructor(private readonly configService: ConfigService) {
    this.app = getApps()[0] ?? initializeApp(this.getFirebaseOptions());
    this.auth = getAuth(this.app);
  }

  async verifyIdToken(token: string): Promise<DecodedIdToken> {
    try {
      return await this.auth.verifyIdToken(token);
    } catch {
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }

  private getFirebaseOptions() {
    const serviceAccountPath = this.configService.get<string>(
      'FIREBASE_SERVICE_ACCOUNT_PATH',
    );
    if (serviceAccountPath) return { credential: cert(serviceAccountPath) };
    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
    const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');
    const privateKey = this.configService
      .get<string>('FIREBASE_PRIVATE_KEY')
      ?.replace(/\n/g, '\n');
    if (projectId && clientEmail && privateKey)
      return { credential: cert({ projectId, clientEmail, privateKey }) };
    return projectId ? { projectId } : undefined;
  }
}
