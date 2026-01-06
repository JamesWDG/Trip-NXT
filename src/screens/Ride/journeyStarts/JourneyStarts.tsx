import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import BottomSheetComponent, {
  BottomSheetComponentRef,
} from '../../../components/bottomSheetComp/BottomSheetComp';
import RideWrapper from '../../../components/rideWrapper/RideWrapper';
import { NavigationProp } from '@react-navigation/native';
import { Phone } from 'lucide-react-native';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import images from '../../../config/images';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import DriverDetailsComp from '../../../components/driverDetailsComp/DriverDetailsComp';
import PrimaryHeader from '../../../components/primaryHeader/PrimaryHeader';

const JourneyStarts = ({ navigation }: { navigation: NavigationProp<any> }) => {
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

  const handleCancelRequest = () => {
    // Handle cancel request
    console.log('Cancel request');
    openRefModal.current?.close();

    setTimeout(() => {
      navigation.navigate('YouArrived');
    }, 100);
  };

  return (
    <RideWrapper navigation={navigation} source={images.driver_arrived}>
      <PrimaryHeader
        title={'Journey Starts'}
        onBackPress={() => navigation?.goBack()}
      />

      <BottomSheetComponent ref={openRefModal}>
        <DriverDetailsComp
          handleCall={handleCall}
          handleCancelRequest={handleCancelRequest}
        />
      </BottomSheetComponent>
    </RideWrapper>
  );
};

export default JourneyStarts;

const styles = StyleSheet.create({});
