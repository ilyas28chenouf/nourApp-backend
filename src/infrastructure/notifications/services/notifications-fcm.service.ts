import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { FirebaseAdminService } from '../../firebase/firebase-admin.service';
import { AppLoggerService } from '../../logger/app-logger.service';
import { DeviceTokenModel } from '../../../domain/notifications/model/device-token.model';
import { NotificationsTypeormAdapter } from '../adapters/notifications-typeorm.adapter';

export interface SendNotificationPayload {
  title: string;
  body: string;
  type: string;
  data?: Record<string, string | number | boolean | null | undefined>;
  scheduledNotificationId?: string;
  contentId?: string;
  screen?: string;
}

export interface NotificationSendResult {
  successCount: number;
  failureCount: number;
  messageIds: string[];
  errors: string[];
}

@Injectable()
export class NotificationsFcmService {
  constructor(
    private readonly firebaseAdmin: FirebaseAdminService,
    private readonly notifications: NotificationsTypeormAdapter,
    private readonly logger: AppLoggerService,
  ) {}

  sendToUser(userId: string, payload: SendNotificationPayload) {
    return this.notifications
      .findActiveDeviceTokensByUser(userId)
      .then((tokens) => this.sendToTokens(tokens, payload));
  }

  async sendToToken(fcmToken: string, payload: SendNotificationPayload) {
    return this.sendToTokens(
      [{ token: fcmToken } as DeviceTokenModel],
      payload,
    );
  }

  async sendToTokens(
    tokens: DeviceTokenModel[],
    payload: SendNotificationPayload,
  ): Promise<NotificationSendResult> {
    const result: NotificationSendResult = {
      successCount: 0,
      failureCount: 0,
      messageIds: [],
      errors: [],
    };

    let messaging;
    try {
      messaging = this.firebaseAdmin.getMessaging();
    } catch (error) {
      throw new ServiceUnavailableException(
        `Firebase Admin credentials are not configured for notifications: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
      );
    }

    // Firebase routes iOS delivery through APNs using an FCM registration token.
    // The device platform does not select a different backend transport.
    for (const token of tokens) {
      try {
        const messageId = await messaging.send({
          token: token.token,
          notification: {
            title: payload.title,
            body: payload.body,
          },
          data: this.stringifyData({
            ...payload.data,
            type: payload.type,
            scheduledNotificationId: payload.scheduledNotificationId,
            contentId: payload.contentId,
            screen: payload.screen,
          }),
          android: {
            priority: 'high',
            notification: {
              channelId: 'daily-reminders',
              sound: 'default',
            },
          },
        });
        result.successCount += 1;
        result.messageIds.push(messageId);
      } catch (error) {
        result.failureCount += 1;
        const safeCode = this.getErrorCode(error);
        if (this.isCredentialError(safeCode)) {
          throw new ServiceUnavailableException(
            `Firebase Admin credentials are not configured for notifications: ${safeCode}`,
          );
        }
        result.errors.push(safeCode);
        this.logger.warn('FCM token send failed', {
          userId: token.userId,
          deviceTokenId: token.id,
          code: safeCode,
        });

        if (token.id && this.isInvalidTokenError(safeCode)) {
          await this.notifications.deactivateDeviceToken(token.id);
        }
      }
    }

    return result;
  }

  private stringifyData(data: Record<string, unknown>) {
    return Object.fromEntries(
      Object.entries(data)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, String(value)]),
    );
  }

  private getErrorCode(error: unknown) {
    if (!error || typeof error !== 'object') return 'unknown';
    const candidate = error as { code?: string; errorInfo?: { code?: string } };
    return candidate.code ?? candidate.errorInfo?.code ?? 'unknown';
  }

  private isInvalidTokenError(code: string) {
    return [
      'messaging/registration-token-not-registered',
      'messaging/invalid-registration-token',
      'UNREGISTERED',
      'INVALID_ARGUMENT',
    ].includes(code);
  }

  private isCredentialError(code: string) {
    return [
      'app/invalid-credential',
      'messaging/authentication-error',
      'messaging/mismatched-credential',
      'messaging/invalid-apns-credentials',
    ].includes(code);
  }
}
