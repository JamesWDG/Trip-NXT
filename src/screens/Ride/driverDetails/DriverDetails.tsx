import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import RideWrapper from '../../../components/rideWrapper/RideWrapper';
import { NavigationProp } from '@react-navigation/native';
import BottomSheetComponent, {
  BottomSheetComponentRef,
} from '../../../components/bottomSheetComp/BottomSheetComp';
import { Phone } from 'lucide-react-native';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import images from '../../../config/images';
import Button from '../../../components/button/Button';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import PrimaryHeader from '../../../components/primaryHeader/PrimaryHeader';

const DriverDetails = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [fromLocation, setFromLocation] = useState('Lorem Ipsum Dummy Text');
  const [toLocation, setToLocation] = useState('Lorem Ipsum Dummy Text');
  const openRefModal = useRef<BottomSheetComponentRef>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      openRefModal.current?.open();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleCall = () => {
    // Handle call action
    console.log('Calling driver...');
  };

  const handleChangeFrom = () => {
    // Handle change from location
    console.log('Change from location');
  };

  const handleChangeTo = () => {
    // Handle change to location
    console.log('Change to location');
  };

  const handleCancelRequest = () => {
    // Handle cancel request
    console.log('Cancel request');
    openRefModal.current?.close();

    setTimeout(() => {
      navigation.navigate('DriverArrived');
    }, 100);
  };

  return (
    <RideWrapper navigation={navigation}>
      <PrimaryHeader
        title={'Driver Details'}
        color={colors.white}
        onBackPress={() => navigation?.goBack()}
      />
      <BottomSheetComponent ref={openRefModal}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Text style={styles.title}>Driver Details</Text>

          {/* Driver Information */}
          <View style={styles.driverInfoContainer}>
            <Image
              source={images.user_avatar}
              style={styles.driverAvatar}
              resizeMode="cover"
            />
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>Lorem Ipsum</Text>
              <View style={styles.phoneContainer}>
                <Phone size={14} color={colors.c_F47E20} />
                <Text style={styles.phoneNumber}>123 456 7890</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.callButton}
              onPress={handleCall}
              activeOpacity={0.7}
            >
              <Phone size={20} color={colors.white} />
            </TouchableOpacity>
          </View>

          {/* Vehicle Information */}
          <View style={styles.vehicleContainer}>
            <Image
              source={images.black_car}
              style={styles.vehicleImage}
              resizeMode="contain"
            />
            <View style={styles.vehicleDetails}>
              <Text style={styles.vehicleName}>Volkswagen Golf</Text>
              <Text style={styles.licensePlate}>UP16CC1234</Text>
            </View>
          </View>

          {/* Journey Details */}
          <View style={styles.journeyContainer}>
            <Text style={styles.journeyTitle}>Journey Details</Text>

            {/* From Field */}
            <View style={styles.locationField}>
              <View style={styles.locationContent}>
                <View style={styles.dotContainer}>
                  <View style={[styles.dot, styles.dotSmall]} />
                  <View
                    style={[styles.dot, styles.dotLarge, styles.dotActive]}
                  />
                  <View style={[styles.dot, styles.dotSmall]} />
                </View>
                <View style={styles.locationTextContainer}>
                  <Text style={styles.locationLabel}>From</Text>
                  <Text style={styles.locationValue} numberOfLines={1}>
                    {fromLocation}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.changeButton}
                onPress={handleChangeFrom}
                activeOpacity={0.7}
              >
                <Text style={styles.changeButtonText}>Change</Text>
              </TouchableOpacity>
            </View>

            {/* To Field */}
            <View style={styles.locationField}>
              <View style={styles.locationContent}>
                <View style={styles.dotContainer}>
                  <View style={[styles.dot, styles.dotSmall]} />
                  <View
                    style={[styles.dot, styles.dotLarge, styles.dotActive]}
                  />
                </View>
                <View style={styles.locationTextContainer}>
                  <Text style={styles.locationLabel}>To</Text>
                  <Text style={styles.locationValue} numberOfLines={1}>
                    {toLocation}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.changeButton}
                onPress={handleChangeTo}
                activeOpacity={0.7}
              >
                <Text style={styles.changeButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Cancel Request Button */}
          <GradientButtonForAccomodation
            title="Cancel Request"
            onPress={handleCancelRequest}
            color={colors.white}
            fontSize={16}
            fontFamily={fonts.bold}
            otherStyles={styles.cancelButton}
          />
        </ScrollView>
      </BottomSheetComponent>
    </RideWrapper>
  );
};

export default DriverDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 24,
    textAlign: 'center',
  },
  driverInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.c_F3F3F3,
  },
  driverDetails: {
    flex: 1,
    gap: 4,
  },
  driverName: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  phoneNumber: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.c_F47E20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  vehicleImage: {
    width: 100,
    height: 60,
    borderRadius: 8,
  },
  vehicleDetails: {
    flex: 1,
    gap: 4,
  },
  vehicleName: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  licensePlate: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.primary,
  },
  journeyContainer: {
    marginBottom: 24,
  },
  journeyTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 16,
  },
  locationField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.c_F3F3F3,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
    gap: 12,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  dotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    gap: 4,
  },
  dot: {
    borderRadius: 3,
    backgroundColor: colors.c_F47E20,
  },
  dotSmall: {
    width: 6,
    height: 6,
    opacity: 0.5,
  },
  dotLarge: {
    width: 8,
    height: 8,
  },
  dotActive: {
    opacity: 1,
  },
  locationTextContainer: {
    flex: 1,
    gap: 4,
  },
  locationLabel: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.c_F47E20,
  },
  locationValue: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  changeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.c_DDDDDD,
  },
  changeButtonText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.c_666666,
  },
  connectingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginVertical: 4,
    marginLeft: 9,
  },
  cancelButton: {
    width: '100%',
    marginTop: 10,
  },
});
