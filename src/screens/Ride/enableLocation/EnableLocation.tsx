import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import RideWrapper from '../../../components/rideWrapper/RideWrapper';
import PrimaryHeader from '../../../components/primaryHeader/PrimaryHeader';
import { NavigationProp } from '@react-navigation/native';
import BottomSheetComponent, {
  BottomSheetComponentRef,
} from '../../../components/bottomSheetComp/BottomSheetComp';
import { MapPin } from 'lucide-react-native';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import Button from '../../../components/button/Button';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
// import GeolocationModule from '@react-native-community/geolocation';

const EnableLocation = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  const openRefModal = useRef<BottomSheetComponentRef>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      openRefModal.current?.open();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleNotNow = () => {
    openRefModal.current?.close();
    // Handle "Not Now" action
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        // Check if permission is already granted
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (granted) {
          Alert.alert('Success', 'Location permission already granted');
          return true;
        }

        // Request permission
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'TripNxt needs access to your location to provide better experience.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          // Alert.alert('Success', 'Location permission granted');
          return true;
        } else {
          Alert.alert(
            'Permission Denied',
            'Location permission is required to use this feature.',
          );
          return false;
        }
      } catch (err) {
        console.warn('Location permission error:', err);
        Alert.alert('Error', 'Failed to request location permission');
        return false;
      }
    } else {
      // iOS - Permission is requested automatically when accessing location
      // We can check permission status using Geolocation
      try {
        // Try to get current position to trigger permission request
        let Geolocation: any;
        try {
          const GeolocationModule = require('@react-native-community/geolocation');
          Geolocation = GeolocationModule.default || GeolocationModule;
        } catch {
          Alert.alert(
            'Error',
            'Geolocation library not found. Please install @react-native-community/geolocation',
          );
          return false;
        }

        Geolocation.getCurrentPosition(
          () => {
            Alert.alert('Success', 'Location permission granted');
          },
          (error: any) => {
            if (error.code === 1) {
              // PERMISSION_DENIED
              Alert.alert(
                'Permission Denied',
                'Please enable location permission in Settings.',
              );
            } else {
              Alert.alert('Error', 'Failed to get location');
            }
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
        return true;
      } catch (error) {
        console.warn('iOS location error:', error);
        Alert.alert('Error', 'Failed to request location permission');
        return false;
      }
    }
  };

  const handleOkSure = async () => {
    openRefModal.current?.close();
    // Request location permission
    await requestLocationPermission().then(res => {
      if (res) {
        navigation.navigate('ChooseDestination');
      }
    });
  };

  return (
    <RideWrapper navigation={navigation}>
      <PrimaryHeader
        title={'Enable Location'}
        onBackPress={() => navigation?.goBack()}
      />

      <BottomSheetComponent ref={openRefModal}>
        <View style={styles.container}>
          {/* Map Icon */}
          <View style={styles.iconContainer}>
            <MapPin size={48} color={colors.black} strokeWidth={1.5} />
          </View>

          {/* Heading */}
          <Text style={styles.heading}>Allow your Location</Text>

          {/* Description */}
          <Text style={styles.description}>
            We will need your Location to give you better Experience.
          </Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {/* Not Now Button */}
            <TouchableOpacity
              style={styles.notNowButton}
              onPress={handleNotNow}
              activeOpacity={0.7}
            >
              <Text style={styles.notNowText}>Not Now</Text>
            </TouchableOpacity>

            {/* Ok Sure Button */}
            <GradientButtonForAccomodation
              title="Ok Sure"
              onPress={handleOkSure}
              color={colors.white}
              fontSize={16}
              fontFamily={fonts.bold}
              otherStyles={styles.okButton}
            />
          </View>
        </View>
      </BottomSheetComponent>
    </RideWrapper>
  );
};

export default EnableLocation;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  notNowButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  notNowText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  okButton: {
    width: '100%',
  },
});
