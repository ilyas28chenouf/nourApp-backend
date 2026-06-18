import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  App,
  applicationDefault,
  cert,
  getApps,
  initializeApp,
} from 'firebase-admin/app';
import { Auth, DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { Messaging, getMessaging } from 'firebase-admin/messaging';
import { readFileSync } from 'fs';

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

  getMessaging(): Messaging {
    return getMessaging(this.app);
  }

  private getFirebaseOptions() {
    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
    const serviceAccountBase64 = this.configService.get<string>(
      'FIREBASE_SERVICE_ACCOUNT_BASE64',
    );
    const serviceAccountPath = this.configService.get<string>(
      'FIREBASE_SERVICE_ACCOUNT_PATH',
    );

    if (serviceAccountBase64) {
      const serviceAccount = JSON.parse(
        Buffer.from(serviceAccountBase64, 'base64').toString('utf8'),
      );
      return { credential: cert(serviceAccount), projectId };
    }

    if (serviceAccountPath) {
      const serviceAccount = JSON.parse(
        readFileSync(serviceAccountPath, 'utf8'),
      );
      return { credential: cert(serviceAccount), projectId };
    }

    const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');
    const privateKey = this.configService
      .get<string>('FIREBASE_PRIVATE_KEY')
      ?.replace(/\\n/g, '\n');
    if (projectId && clientEmail && privateKey) {
      return { credential: cert({ projectId, clientEmail, privateKey }) };
    }

    return { credential: applicationDefault(), projectId };
  }
}
