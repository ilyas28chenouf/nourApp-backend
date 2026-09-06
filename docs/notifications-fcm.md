# Push token contract

`POST /api/notifications/device-token` requires a Firebase Cloud Messaging
(FCM) registration token for both `IOS` and `ANDROID`. The request fields remain
`token`, `platform`, and optional `deviceId` and `appVersion`.

Registration stores `provider = FCM` on both insert and update. `platform` describes
the operating system, not the transport. The database defaults the provider to
FCM. Active tokens are selected by user and active status without platform or
provider filtering. Test and scheduled notifications both use
`NotificationsFcmService`, which calls Firebase Admin `Messaging.send()` for every
token. There is no direct APNs client or platform-based transport routing.

## Mobile integration

With `expo-notifications`, `getDevicePushTokenAsync()` returns an FCM token on
Android and a raw APNs token on iOS. The latter cannot be used as the token in a
Firebase Admin message. Obtain the iOS FCM registration token through the Firebase
Messaging SDK and register it with this endpoint; register refreshed tokens too.
An Expo push token from `getExpoPushTokenAsync()` is also unsupported.

Configure the Apple app and its APNs credentials in the same Firebase project
used by the backend. Firebase handles the FCM-to-APNs delivery. The backend's
`messaging/invalid-apns-credentials` handling reports a Firebase delivery error;
it is not a direct APNs implementation.

The endpoint validates a nonempty string, not its provenance. Storing the FCM
provider does not validate or convert a raw APNs token. Token formats are opaque;
Firebase determines validity when sending. Existing raw APNs entries cannot be
converted by this backend and need replacement with client-issued FCM tokens.
This backend clarification alone does not repair iOS delivery without that mobile
change. No transport or Android payload behavior has changed.

References: [Expo native tokens](https://docs.expo.dev/push-notifications/sending-notifications-custom/)
and [Firebase Apple setup](https://firebase.google.com/docs/cloud-messaging/ios/get-started).
