import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import RideWrapper from '../../../components/rideWrapper/RideWrapper';
import { NavigationProp } from '@react-navigation/native';
import PrimaryHeader from '../../../components/primaryHeader/PrimaryHeader';
import { Clock, Navigation } from 'lucide-react-native';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import Button from '../../../components/button/Button';
import DestinationSearch from '../../../components/destinationSearch/DestinationSearch';
import BottomSheetComponent, {
  BottomSheetComponentRef,
} from '../../../components/bottomSheetComp/BottomSheetComp';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';

const ChooseDestination = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  const [fromLocation, setFromLocation] = useState('Lorem Ipsum Dummy Text');
  const [toLocation, setToLocation] = useState('Lorem Ipsum Dummy Text');
  const [selectedDate, setSelectedDate] = useState('Lorem Ipsum');
  const [selectedTime, setSelectedTime] = useState('Lorem Ipsum Dummy');
  const openRefModal = useRef<BottomSheetComponentRef>(null);
  const handleSearchNow = () => {
    // Handle search action
    console.log('Search:', {
      fromLocation,
      toLocation,
      selectedDate,
      selectedTime,
    });
    openRefModal.current?.close();
    setTimeout(() => {
      navigation.navigate('ChooseYourCar');
    }, 100);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      openRefModal.current?.open();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <RideWrapper navigation={navigation}>
      <PrimaryHeader
        title={'Choose Destination'}
        onBackPress={() => navigation?.goBack()}
      />

      <BottomSheetComponent ref={openRefModal}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Card */}
          <View style={styles.card}>
            {/* From Field */}
            <TouchableOpacity
              style={styles.fieldContainer}
              activeOpacity={0.7}
              onPress={() => {
                // Navigate to search or open search modal
              }}
            >
              <View style={styles.dotContainer}>
                <View style={[styles.dot, styles.dotSmall]} />
                <View style={[styles.dot, styles.dotLarge, styles.dotActive]} />
                <View style={[styles.dot, styles.dotSmall]} />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>From</Text>
                <Text style={styles.fieldValue} numberOfLines={1}>
                  {fromLocation}
                </Text>
              </View>
              <Navigation size={20} color={colors.c_666666} />
            </TouchableOpacity>

            {/* Connecting Line */}
            <View style={styles.connectingLine} />

            {/* To Field */}
            <TouchableOpacity
              style={styles.fieldContainer}
              activeOpacity={0.7}
              onPress={() => {
                // Navigate to search or open search modal
              }}
            >
              <View style={styles.dotContainer}>
                <View style={[styles.dot, styles.dotSmall]} />
                <View style={[styles.dot, styles.dotLarge, styles.dotActive]} />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>To</Text>
                <Text style={styles.fieldValue} numberOfLines={1}>
                  {toLocation}
                </Text>
              </View>
              <Navigation size={20} color={colors.c_666666} />
            </TouchableOpacity>

            {/* Time/Date Options */}
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionItem}
                activeOpacity={0.7}
                onPress={() => {
                  // Open date picker
                }}
              >
                <Clock size={20} color={colors.black} />
                <Text style={styles.optionText}>{selectedDate}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionItem}
                activeOpacity={0.7}
                onPress={() => {
                  // Open time picker
                }}
              >
                <Clock size={20} color={colors.black} />
                <Text style={styles.optionText}>{selectedTime}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Now Button */}
          <GradientButtonForAccomodation
            title="Search Now"
            onPress={handleSearchNow}
            color={colors.white}
            fontSize={16}
            fontFamily={fonts.bold}
            otherStyles={styles.searchButton}
          />
        </ScrollView>
      </BottomSheetComponent>
    </RideWrapper>
  );
};

export default ChooseDestination;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.c_F3F3F3,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
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
  fieldContent: {
    flex: 1,
    gap: 4,
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.c_F47E20,
  },
  fieldValue: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  connectingLine: {
    width: 2,
    height: 8,
    backgroundColor: colors.c_DDDDDD,
    marginLeft: 9,
    marginBottom: 4,
  },
  optionsContainer: {
    marginTop: 8,
    gap: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  optionText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  searchButton: {
    width: '100%',
    marginTop: 10,
  },
});
