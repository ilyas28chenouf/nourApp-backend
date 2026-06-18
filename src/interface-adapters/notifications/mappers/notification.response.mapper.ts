export class NotificationResponseMapper {
  static toDeviceTokenDto(model: any) {
    return {
      id: model.id,
      userId: model.userId,
      platform: model.platform,
      provider: model.provider,
      isActive: model.isActive,
      lastSeenAt: model.lastSeenAt?.toISOString?.() ?? model.lastSeenAt,
    };
  }

  static toScheduledDto(model: any) {
    return {
      id: model.id,
      userId: model.userId,
      type: model.type,
      title: model.title,
      body: model.body,
      scheduledAt: model.scheduledAt?.toISOString?.() ?? model.scheduledAt,
      sentAt: model.sentAt?.toISOString?.() ?? model.sentAt,
      status: model.status,
      metadata: model.metadata,
      createdAt: model.createdAt?.toISOString?.() ?? model.createdAt,
      updatedAt: model.updatedAt?.toISOString?.() ?? model.updatedAt,
    };
  }

  static toScheduledDtoList(models: any[]) {
    return models.map((model) => this.toScheduledDto(model));
  }
}
