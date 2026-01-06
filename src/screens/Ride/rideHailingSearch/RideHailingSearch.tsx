import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import RideWrapper from '../../../components/rideWrapper/RideWrapper';
import { NavigationProp } from '@react-navigation/native';
import DestinationSearch from '../../../components/destinationSearch/DestinationSearch';
import PrimaryHeader from '../../../components/primaryHeader/PrimaryHeader';

const RideHailingSearch = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  return (
    <RideWrapper navigation={navigation}>
      <PrimaryHeader title={''} onBackPress={() => navigation?.goBack()} />
      <DestinationSearch
        onItemPress={item => {
          navigation.navigate('SaveAddress', {
            location: item.destination,
          });
        }}
      />
    </RideWrapper>
  );
};

export default RideHailingSearch;

const styles = StyleSheet.create({});
