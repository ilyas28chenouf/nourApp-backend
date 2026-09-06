import { DeviceTokenModel } from '../../domain/notifications/model/device-token.model';
import { NotificationsPersistencePort } from '../../domain/notifications/ports/notifications-persistence.port';

export type RegisterDeviceTokenInput = Pick<
  DeviceTokenModel,
  'token' | 'platform' | 'deviceId' | 'appVersion'
>;

export class RegisterDeviceTokenUsecase {
  constructor(private readonly persistence: NotificationsPersistencePort) {}
  async execute(userId: string, data: RegisterDeviceTokenInput) {
    const existing = await this.persistence.findDeviceTokenByToken(data.token);
    const payload: Partial<DeviceTokenModel> = {
      ...data,
      userId,
      // Platform is device metadata; both iOS and Android use FCM tokens.
      provider: 'FCM',
      isActive: true,
      lastSeenAt: new Date(),
    };
    return existing
      ? this.persistence.updateDeviceToken(existing.id, payload)
      : this.persistence.createDeviceToken(payload);
  }
}
