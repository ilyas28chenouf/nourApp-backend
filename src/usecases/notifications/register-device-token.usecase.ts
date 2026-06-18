export class RegisterDeviceTokenUsecase {
  constructor(
    private readonly persistence: import('../../domain/notifications/ports/notifications-persistence.port').NotificationsPersistencePort,
  ) {}
  async execute(userId: string, data: any) {
    const existing = await this.persistence.findDeviceTokenByToken(data.token);
    const payload = {
      ...data,
      userId,
      provider: 'FCM',
      isActive: true,
      lastSeenAt: new Date(),
    };
    return existing
      ? this.persistence.updateDeviceToken(existing.id, payload)
      : this.persistence.createDeviceToken(payload);
  }
}
