import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import RideWrapper from '../../../components/rideWrapper/RideWrapper';
import PrimaryHeader from '../../../components/primaryHeader/PrimaryHeader';
import { NavigationProp } from '@react-navigation/native';
import colors from '../../../config/colors';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import fonts from '../../../config/fonts';

const FindingYourRide = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  const hanldeCancelRequest = () => {
    navigation.navigate('DriverDetails');
  };
  return (
    <RideWrapper navigation={navigation}>
      <PrimaryHeader
        title={'Finding Your Ride'}
        color={colors.black}
        onBackPress={() => navigation?.goBack()}
      />

      <View style={styles.container}>
        <GradientButtonForAccomodation
          title="Cancel Request"
          onPress={hanldeCancelRequest}
          color={colors.white}
          fontFamily={fonts.bold}
        />
      </View>
    </RideWrapper>
  );
};

export default FindingYourRide;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    flex: 1,
    bottom: 120,
  },
});
