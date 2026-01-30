import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useMemo, useState } from 'react';
import GeneralStyles from '../../../utils/GeneralStyles';
import FoodHeader from '../../../components/foodHeader/FoodHeader';
import { NavigationProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MainCarousel from '../../../components/mainCarousel/MainCarousel';
import { CarouselData } from '../../../constants/Accomodation';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import OrderTrackingProgress from '../../../components/orderTrackingProgress/OrderTrackingProgress';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import FastImage from 'react-native-fast-image';
import images from '../../../config/images';

const OrderTracking = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const { top } = useSafeAreaInsets();
  const [isFavorite, setIsFavorite] = useState(false);

  const wishlistButtonStyles = useMemo(() => wishlistButton(top), [top]);
  const contentStyles = useMemo(() => makeContentStyles(top), [top]);

  // Order tracking stages
  const orderStages = [
    { label: 'Order', completed: true },
    { label: 'In Transit', completed: true },
    { label: 'On Way', completed: true },
    { label: 'Delivered', completed: false },
  ];

  const onMessage = () => {
    navigation.navigate('FoodChat');
  };
  const onPostReview = () => {
    navigation.navigate('FoodTripDetails');
  };
  return (
    <View style={GeneralStyles.flex}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <FoodHeader
          onBackPress={() => navigation?.navigate('FoodHome')}
          onNotificationPress={() => {}}
          onCartPress={() => {}}
          onFavoritePress={() => setIsFavorite(!isFavorite)}
          isFavorite={isFavorite}
        />
      </View>

      {/* Map Carousel */}
      <View style={wishlistButtonStyles.carouselContainer}>
        <MainCarousel data={['https://assets.epicurious.com/photos/5988e3458e3ab375fe3c0caf/1:1/w_3607,h_3607,c_limit/How-to-Make-Chicken-Alfredo-Pasta-hero-02082017.jpg']} />
      </View>

      {/* White Content Card */}
      <View style={contentStyles.contentCard}>
        <ScrollView
          style={GeneralStyles.flex}
          contentContainerStyle={contentStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Order Tracking Progress */}
          <View style={styles.progressContainer}>
            <OrderTrackingProgress stages={orderStages} />

            <FastImage
              source={images.order_tracking}
              style={styles.orderTrackingImage}
            />
            <View style={styles.actionButtonsContainer}>
              {/* <TouchableOpacity
              style={styles.addItemButton}
              onPress={handleAddItem}
              activeOpacity={0.8}
            >
              <Text style={styles.addItemText}>Add Item</Text>
            </TouchableOpacity> */}
              <GradientButtonForAccomodation
                title="Call"
                onPress={() => {}}
                color={colors.black}
                fontSize={16}
                fontFamily={fonts.semibold}
                otherStyles={styles.addItemButton}
              />

              <GradientButtonForAccomodation
                title="Message"
                onPress={onMessage}
                fontSize={16}
                fontFamily={fonts.semibold}
                otherStyles={styles.checkoutButton}
              />
            </View>
          </View>

          <GradientButtonForAccomodation
            title="Post a Review"
            onPress={onPostReview}
            fontSize={16}
            fontFamily={fonts.semibold}
            otherStyles={styles.checkoutButton}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default OrderTracking;

const makeContentStyles = (top: number) =>
  StyleSheet.create({
    contentCard: {
      flex: 1,
      backgroundColor: colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginTop: -90,
      zIndex: 999,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: top + 50,
      paddingHorizontal: 20,
      //   paddingTop: 20,
    },
  });

const wishlistButton = (top: number) =>
  StyleSheet.create({
    scrollViewContent: { flexGrow: 1, paddingBottom: top + 50 },
    carouselContainer: {
      zIndex: 10,
      marginTop: -top + 20,
    },
  });

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  orderTrackingImage: {
    height: 400,
    marginVertical: 20,
  },
  progressContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 20,
  },

  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  addItemButton: {
    flex: 1,
    height: 50,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.c_666666,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutButton: {
    flex: 1,
    height: 50,
    borderRadius: 100,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
