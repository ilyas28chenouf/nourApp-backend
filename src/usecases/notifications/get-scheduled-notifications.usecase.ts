export class GetScheduledNotificationsUsecase {
  constructor(
    private readonly persistence: import('../../domain/notifications/ports/notifications-persistence.port').NotificationsPersistencePort,
  ) {}
  execute(userId: string, limit?: number) {
    return this.persistence.findScheduled(userId, limit);
  }
}
