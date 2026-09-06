import { DevicePlatform } from '../../domain/notifications/enums/device-platform.enum';
import { NotificationsPersistencePort } from '../../domain/notifications/ports/notifications-persistence.port';
import { RegisterDeviceTokenUsecase } from './register-device-token.usecase';

describe('RegisterDeviceTokenUsecase FCM registration', () => {
  it.each([DevicePlatform.IOS, DevicePlatform.ANDROID])(
    'creates and reactivates %s tokens with the FCM provider',
    async (platform) => {
      const persistence = {
        findDeviceTokenByToken: jest
          .fn()
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce({ id: 'device-1', isActive: false }),
        createDeviceToken: jest.fn().mockResolvedValue({ id: 'device-1' }),
        updateDeviceToken: jest.fn().mockResolvedValue({ id: 'device-1' }),
      };
      const usecase = new RegisterDeviceTokenUsecase(
        persistence as unknown as NotificationsPersistencePort,
      );
      const input = { token: 'fcm-registration-token', platform };
      const expected = expect.objectContaining({
        ...input,
        userId: 'user-1',
        provider: 'FCM',
        isActive: true,
        lastSeenAt: expect.any(Date),
      });

      await usecase.execute('user-1', input);
      expect(persistence.createDeviceToken).toHaveBeenCalledWith(expected);
      await usecase.execute('user-1', input);
      expect(persistence.updateDeviceToken).toHaveBeenCalledWith(
        'device-1',
        expected,
      );
      expect(persistence.createDeviceToken).toHaveBeenCalledTimes(1);
    },
  );
});
