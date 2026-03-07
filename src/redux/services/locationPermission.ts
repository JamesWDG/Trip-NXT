import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const LOCATION_SETTINGS_MSG =
  'Location permission is required for ride booking and better experience. Please enable it in Settings.';

/**
 * Request location permission on app open.
 * If user denies (or has denied before), show alert with "Open Settings" to navigate to app settings.
 */
export async function requestLocationPermissionAndPromptSettings(): Promise<boolean> {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted) return true;

      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Trip-NXT needs your location for ride booking and a better experience.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'Allow',
        }
      );

      if (result === PermissionsAndroid.RESULTS.GRANTED) return true;

      // Denied or NEVER_ASK_AGAIN: show alert to open Settings
      Alert.alert(
        'Location Permission',
        LOCATION_SETTINGS_MSG,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    } catch (err) {
      console.warn('Location permission error:', err);
      Alert.alert(
        'Location Permission',
        LOCATION_SETTINGS_MSG,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    }
  }

  // iOS: trigger permission via getCurrentPosition; if denied, prompt for Settings
  return new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      () => resolve(true),
      (error: any) => {
        if (error?.code === 1) {
          // PERMISSION_DENIED
          Alert.alert(
            'Location Permission',
            LOCATION_SETTINGS_MSG,
            [
              { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
              { text: 'Open Settings', onPress: () => { Linking.openSettings(); resolve(false); } },
            ]
          );
        } else {
          resolve(false);
        }
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
    );
  });
}
