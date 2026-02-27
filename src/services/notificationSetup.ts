import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { store } from '../redux/store';
import { notificationApi } from '../redux/services/notification.service';

/** Call once at app startup, outside React (e.g. in index.js or before App render). */
export function setBackgroundMessageHandler(): void {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Background notification:', remoteMessage?.notification?.title, remoteMessage?.data);
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    return authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
           authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  }
  return true;
}

export async function getFCMToken(): Promise<string | null> {
  try {
    const token = await messaging().getToken();
    if (token) {
      console.log('[FCM] Token:', token);
    }
    return token ?? null;
  } catch (e) {
    console.warn('FCM getToken error:', e);
    return null;
  }
}

/** Register current FCM token with backend. Call when user is logged in. */
export async function registerTokenWithBackend(fcmToken: string): Promise<boolean> {
  try {
    const result = await store.dispatch(
      notificationApi.endpoints.registerFcmToken.initiate({ fcmToken })
    );
    return !('error' in result) && 'data' in result;
  } catch (e) {
    console.warn('Register FCM token error:', e);
    return false;
  }
}

export function onForegroundMessage(callback: (message: import('@react-native-firebase/messaging').FirebaseMessagingTypes.RemoteMessage) => void): () => void {
  const unsub = messaging().onMessage(callback);
  return unsub;
}

export function onNotificationOpenedApp(callback: (message: import('@react-native-firebase/messaging').FirebaseMessagingTypes.RemoteMessage) => void): () => void {
  const unsub = messaging().onNotificationOpenedApp(callback);
  return unsub;
}

/** Call on app launch to check if app was opened from a notification. */
export async function getInitialNotification(): Promise<import('@react-native-firebase/messaging').FirebaseMessagingTypes.RemoteMessage | null> {
  return messaging().getInitialNotification();
}
