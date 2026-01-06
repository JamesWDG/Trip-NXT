import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import BottomSheetComponent, {
  BottomSheetComponentRef,
} from '../../../components/bottomSheetComp/BottomSheetComp';
import RideWrapper from '../../../components/rideWrapper/RideWrapper';
import { NavigationProp, CommonActions } from '@react-navigation/native';
import { Star } from 'lucide-react-native';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import images from '../../../config/images';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import PrimaryHeader from '../../../components/primaryHeader/PrimaryHeader';
import { navigationRef } from '../../../config/constants';

const TripDetailsForRide = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  const openRefModal = useRef<BottomSheetComponentRef>(null);
  const [rating, setRating] = useState<number>(5);
  const [selectedTip, setSelectedTip] = useState<string | null>(null);
  const [review, setReview] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      openRefModal.current?.open();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    console.log('Submit:', { rating, tip: selectedTip, review });
    // Handle submit logic
    openRefModal.current?.close();

    setTimeout(() => {
      if (navigationRef.isReady()) {
        navigationRef.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'app',
                state: {
                  routes: [
                    {
                      name: 'Car',
                      state: {
                        routes: [{ name: 'RideHome' }],
                        index: 0,
                      },
                    },
                  ],
                  index: 0,
                },
              },
            ],
          }),
        );
      }
    }, 100);
  };

  const tipOptions = ['$1.00', '$2.00', '$5.00'];

  return (
    <RideWrapper navigation={navigation}>
      <PrimaryHeader
        title={'Rate Your Trip'}
        onBackPress={() => navigation?.goBack()}
      />

      <BottomSheetComponent ref={openRefModal}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Service Summary */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Time:</Text>
              <Text style={styles.summaryValue}>15 min</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Price:</Text>
              <Text style={styles.summaryValue}>$9,99</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Distance:</Text>
              <Text style={styles.summaryValue}>15 km</Text>
            </View>
          </View>

          {/* Driver Information */}
          <View style={styles.driverSection}>
            <Text style={styles.driverName}>Lorem Ipsum Dummy</Text>
            <Text style={styles.ratePrompt}>Rate your driver</Text>
            <Image
              source={images.user_avatar}
              style={styles.driverAvatar}
              resizeMode="cover"
            />

            {/* Star Rating */}
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  activeOpacity={0.7}
                >
                  <Star
                    size={32}
                    color={colors.c_F47E20}
                    fill={star <= rating ? colors.c_F47E20 : 'transparent'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Tipping Section */}
            <Text style={styles.tipPrompt}>
              Great driver? Consider giving a tip.
            </Text>
            <View style={styles.tipButtonsContainer}>
              {tipOptions.map(tip => (
                <TouchableOpacity
                  key={tip}
                  style={[
                    styles.tipButton,
                    selectedTip === tip && styles.tipButtonSelected,
                  ]}
                  onPress={() => setSelectedTip(tip)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.tipButtonText,
                      selectedTip === tip && styles.tipButtonTextSelected,
                    ]}
                  >
                    {tip}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Review Input */}
          <View style={styles.reviewContainer}>
            <TextInput
              style={styles.reviewInput}
              placeholder="Type your review"
              placeholderTextColor={colors.c_666666}
              value={review}
              onChangeText={setReview}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <GradientButtonForAccomodation
            title="Submit Now"
            onPress={handleSubmit}
            color={colors.white}
            fontSize={16}
            fontFamily={fonts.bold}
            otherStyles={styles.submitButton}
          />
        </ScrollView>
      </BottomSheetComponent>
    </RideWrapper>
  );
};

export default TripDetailsForRide;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  summaryItem: {
    alignItems: 'center',
    gap: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  summaryValue: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
  },
  driverSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  driverName: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 8,
  },
  ratePrompt: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginBottom: 16,
  },
  driverAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.c_F3F3F3,
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  tipPrompt: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginBottom: 16,
  },
  tipButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  tipButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipButtonSelected: {
    backgroundColor: colors.c_0162C0,
  },
  tipButtonText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  tipButtonTextSelected: {
    color: colors.white,
  },
  reviewContainer: {
    marginBottom: 24,
  },
  reviewInput: {
    backgroundColor: colors.c_F3F3F3,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    width: '100%',
  },
});
