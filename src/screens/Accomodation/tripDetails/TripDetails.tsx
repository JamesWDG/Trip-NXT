import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import FastImage from 'react-native-fast-image';
import images from '../../../config/images';
import { ShowToast, width } from '../../../config/constants';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import fonts from '../../../config/fonts';
import { StarIcon } from 'lucide-react-native';
import colors from '../../../config/colors';
import { NavigationProp, ParamListBase, RouteProp } from '@react-navigation/native';
import StarRating from 'react-native-star-rating-widget';
import { useCreateReviewMutation } from '../../../redux/services/review.service';

type routeParams = {
  totalAmount: number,
  subTotal: number,
  discountId: number,
  tax: number,
  deliveryFee: number,
  orderItems: { itemId: number, quantity: number, price: number }[],
  deliveryAddress: { lat: number, lng: number, location: string },
}
type TripDetailsProps = {
  navigation: NavigationProp<ParamListBase, string>;
  route: RouteProp<{ params: routeParams }>;
};

const TripDetails = ({ navigation, route }: TripDetailsProps) => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [createReview, { isLoading }] = useCreateReviewMutation();
  const itemIds = route.params?.orderItems.map(item => item.itemId);
  // const []

  const postReview = async (id: number) => {
    try {
      const payload = {
        referenceType: 'restaurant',
        referenceId: id,
        rating: rating,
        comment: reviewText,
      }
      const response = await createReview(payload).unwrap();
      console.log('response posting review', response);
    } catch (error) {
      console.log('error posting review', error);
    }
  }

  const handleSubmit = async () => {
    try {
      const promises = itemIds.map(id => postReview(id));
      await Promise.all(promises);
      ShowToast('success', 'Reviews posted successfully');
      navigation.navigate('FoodHome')
    } catch (error) {
      ShowToast('error', 'Failed to post reviews');
      console.log('error posting reviews', error);
    }
  }

  return (
    <WrapperContainer onBackPress={() => navigation.navigate('FoodHome')} title="Trip Details" navigation={navigation}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={[styles.title]}>Post a Review</Text>
          <Text style={styles.description}>Rate your food</Text>
          <View style={styles.avatarContainer}>
            <FastImage
              source={images.avatar}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.starContainer}>
            {/* {[1, 2, 3, 4, 5].map(item => (
              <StarIcon
                key={item}
                fill={colors.c_F59523}
                color={colors.c_F59523}
              />
            ))} */}
            <StarRating rating={rating} onChange={setRating} />
          </View>
          <Text style={styles.description}>
            You successfully created your booking. To print your booking.
          </Text>

          <View style={styles.reviewContainer}>
            <TextInput
              style={styles.reviewInput}
              placeholder="Type your review"
              placeholderTextColor={colors.c_505050}
              multiline
              value={reviewText}
              onChangeText={setReviewText}
            />
            {/* <Text style={styles.priceText}>$2.00</Text> */}
          </View>

          <View style={styles.buttonContainer}>
            <GradientButtonForAccomodation
              title="Submit Now"
              onPress={handleSubmit}
              fontSize={16}
              fontFamily={fonts.bold}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </WrapperContainer>
  );
};

export default TripDetails;

const styles = StyleSheet.create({
  avatarContainer: {
    borderColor: colors.c_CFD1D3,
    borderWidth: 1,
    borderRadius: 100,
    marginTop: 15,
    paddingTop: 5,
    height: 90,
    width: 90,
    // padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1 },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.bold,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 15,
  },
  logo: {
    height: 80,
    width: 80,
  },
  buttonContainer: {
    width: width * 0.9,
  },
  starContainer: {
    marginTop: 15,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  reviewContainer: {
    width: width * 0.9,
    marginTop: 20,
    marginBottom: 20,
    position: 'relative',
  },
  reviewInput: {
    backgroundColor: colors.c_F3F3F3,
    // borderWidth: 1,
    // borderColor: colors.primary,
    borderRadius: 8,
    padding: 15,
    paddingBottom: 40,
    minHeight: 120,
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
    textAlignVertical: 'top',
  },
  priceText: {
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.white,
  },
});
