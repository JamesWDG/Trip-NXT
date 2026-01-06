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
import PrimaryHeader from '../../../components/primaryHeader/PrimaryHeader';
import BottomSheetComponent, {
  BottomSheetComponentRef,
} from '../../../components/bottomSheetComp/BottomSheetComp';
import { MapPin } from 'lucide-react-native';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import images from '../../../config/images';
import Button from '../../../components/button/Button';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';

interface Vehicle {
  id: string;
  name: string;
  icon: any;
  availability: string;
  price: string;
  distance: string;
}

const vehicles: Vehicle[] = [
  {
    id: 'bike',
    name: 'Bike',
    icon: images.bike,
    availability: '5 Near By',
    price: '$5.55',
    distance: '3.2Mi',
  },
  {
    id: 'car',
    name: 'Car',
    icon: images.carr,
    availability: '2 Near By',
    price: '$10.20',
    distance: '8Mi',
  },
  {
    id: 'tuktuk',
    name: 'Tuk Tuk',
    icon: images.rickshaw,
    availability: '1 Near By',
    price: '$9.75',
    distance: '3.2Mi',
  },
];

const ChooseYourCar = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const openRefModal = useRef<BottomSheetComponentRef>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('car');

  useEffect(() => {
    const timer = setTimeout(() => {
      openRefModal.current?.open();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleConfirm = () => {
    console.log('Selected Vehicle:', selectedVehicle);
    // Handle confirmation logic
    openRefModal.current?.close();

    setTimeout(() => {
      navigation.navigate('FindingYourRide');
    }, 100);
  };

  return (
    <RideWrapper navigation={navigation}>
      <PrimaryHeader
        title={'Choose Your Car'}
        onBackPress={() => navigation?.goBack()}
      />

      <BottomSheetComponent ref={openRefModal}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <Text style={styles.title}>Select Vehicle</Text>

          {/* Vehicle Options */}
          <View style={styles.vehiclesContainer}>
            {vehicles.map(vehicle => {
              const isSelected = selectedVehicle === vehicle.id;
              return (
                <TouchableOpacity
                  key={vehicle.id}
                  style={[
                    styles.vehicleCard,
                    isSelected && styles.vehicleCardSelected,
                  ]}
                  onPress={() => setSelectedVehicle(vehicle.id)}
                  activeOpacity={0.7}
                >
                  <Image
                    source={vehicle.icon}
                    style={[
                      styles.vehicleIcon,
                      isSelected && styles.vehicleIconSelected,
                    ]}
                    resizeMode="contain"
                  />
                  <Text style={styles.vehicleName}>{vehicle.name}</Text>
                  <Text style={styles.vehicleAvailability}>
                    {vehicle.availability}
                  </Text>
                  <Text style={styles.vehiclePrice}>{vehicle.price}</Text>
                  <View style={styles.distanceContainer}>
                    <MapPin size={14} color={colors.black} />
                    <Text style={styles.vehicleDistance}>
                      {vehicle.distance}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Confirm Button */}
          <GradientButtonForAccomodation
            title="Confirm Now"
            onPress={handleConfirm}
            color={colors.white}
            fontSize={16}
            fontFamily={fonts.bold}
            otherStyles={styles.confirmButton}
          />
        </ScrollView>
      </BottomSheetComponent>
    </RideWrapper>
  );
};

export default ChooseYourCar;

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
    textAlign: 'center',
    marginBottom: 24,
  },
  vehiclesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  vehicleCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.transparent,
  },
  vehicleCardSelected: {
    borderColor: colors.c_F47E20,
    backgroundColor: colors.c_F6F6F6,
  },
  vehicleIcon: {
    width: 48,
    height: 48,
    marginBottom: 12,
    tintColor: colors.black,
  },
  vehicleIconSelected: {
    tintColor: colors.c_F47E20,
  },
  vehicleName: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 4,
  },
  vehicleAvailability: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginBottom: 8,
  },
  vehiclePrice: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 8,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  vehicleDistance: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.black,
  },
  confirmButton: {
    width: '100%',
  },
});
