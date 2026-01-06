import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import BottomSheetComponent, {
  BottomSheetComponentRef,
} from '../../../components/bottomSheetComp/BottomSheetComp';
import RideWrapper from '../../../components/rideWrapper/RideWrapper';
import { NavigationProp } from '@react-navigation/native';

const PlaceInMinutes = ({
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
  return (
    <RideWrapper navigation={navigation}>
      <BottomSheetComponent ref={openRefModal}>
        <></>
      </BottomSheetComponent>
    </RideWrapper>
  );
};

export default PlaceInMinutes;

const styles = StyleSheet.create({});
