import { DevicePlatform } from '../../../domain/notifications/enums/device-platform.enum';
import { DeviceTokenModel } from '../../../domain/notifications/model/device-token.model';
import { FirebaseAdminService } from '../../firebase/firebase-admin.service';
import { AppLoggerService } from '../../logger/app-logger.service';
import { NotificationsTypeormAdapter } from '../adapters/notifications-typeorm.adapter';
import { NotificationsFcmService } from './notifications-fcm.service';

describe('NotificationsFcmService platform routing', () => {
  const tokens = [DevicePlatform.IOS, DevicePlatform.ANDROID].map(
    (platform): DeviceTokenModel => ({
      id: platform,
      userId: 'user-1',
      token: `fcm-${platform}`,
      platform,
      provider: 'FCM',
      isActive: true,
      lastSeenAt: new Date(),
    }),
  );

  function setup() {
    const send = jest.fn().mockResolvedValue('message-id');
    const firebase = { getMessaging: jest.fn().mockReturnValue({ send }) };
    const notifications = {
      findActiveDeviceTokensByUser: jest.fn().mockResolvedValue(tokens),
      deactivateDeviceToken: jest.fn().mockResolvedValue(undefined),
    };
    const logger = { warn: jest.fn() };
    const service = new NotificationsFcmService(
      firebase as unknown as FirebaseAdminService,
      notifications as unknown as NotificationsTypeormAdapter,
      logger as unknown as AppLoggerService,
    );
    return { service, send, notifications };
  }

  const payload = { title: 'Reminder', body: 'Test', type: 'TEST' };

  it('sends both platforms through Firebase and preserves Android options', async () => {
    const { service, send, notifications } = setup();
    const result = await service.sendToUser('user-1', payload);

    expect(notifications.findActiveDeviceTokensByUser).toHaveBeenCalledWith(
      'user-1',
    );
    expect(send).toHaveBeenCalledTimes(2);
    for (const [index, token] of tokens.entries()) {
      expect(send).toHaveBeenNthCalledWith(index + 1, {
        token: token.token,
        notification: { title: payload.title, body: payload.body },
        data: { type: payload.type },
        android: {
          priority: 'high',
          notification: { channelId: 'daily-reminders', sound: 'default' },
        },
      });
    }
    expect(result).toEqual({
      successCount: 2,
      failureCount: 0,
      messageIds: ['message-id', 'message-id'],
      errors: [],
    });
  });

  it('deactivates an invalid iOS registration and continues sending to Android', async () => {
    const { service, send, notifications } = setup();
    send.mockRejectedValueOnce({
      code: 'messaging/invalid-registration-token',
    });

    const result = await service.sendToTokens(tokens, payload);

    expect(notifications.deactivateDeviceToken).toHaveBeenCalledWith(
      DevicePlatform.IOS,
    );
    expect(send).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      successCount: 1,
      failureCount: 1,
      messageIds: ['message-id'],
      errors: ['messaging/invalid-registration-token'],
    });
  });
});
