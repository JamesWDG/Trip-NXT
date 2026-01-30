import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useMemo, useState } from 'react';
import GeneralStyles from '../../../utils/GeneralStyles';
import HomeHeader from '../../../components/homeHeader/HomeHeader';
import { NavigationProp } from '@react-navigation/native';
import RestaurantHeader from '../../../components/RestaurantHeader/ReataurantHeader';
import MainCarousel from '../../../components/mainCarousel/MainCarousel';
import { CarouselData } from '../../../constants/Accomodation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../../config/colors';
import SearchWithFilters from '../../../components/searchWithFilters/SearchWithFilters';
import labels from '../../../config/labels';
import FoodCard from '../../../components/foodCard/FoodCard';
import FoodReviewCard from '../../../components/foodReviewCard/FoodReviewCard';
import images from '../../../config/images';
import RestaurantCard from '../../../components/restaurantCard/RestaurantCard';

const RestaurantInfo = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  const { top } = useSafeAreaInsets();
  const [wishlist, setWishlist] = useState(false);
  const wishlistButtonStyles = useMemo(() => {
    return wishlistButton(wishlist, top);
  }, [wishlist]);
  return (
    <View style={GeneralStyles.flex}>
      <View style={styles.headerContainer}>
        <RestaurantHeader
          navigation={navigation}
          onPress={() => {}}
          onBackPress={() => navigation.goBack()}
        />
      </View>
      <View style={wishlistButtonStyles.carouselContainer}>
        <MainCarousel data={['https://assets.epicurious.com/photos/5988e3458e3ab375fe3c0caf/1:1/w_3607,h_3607,c_limit/How-to-Make-Chicken-Alfredo-Pasta-hero-02082017.jpg']} />
      </View>

      <View style={styles.lowerContainer}>
        <View style={styles.restaurantCardContainer}>
          <SearchWithFilters
            placeholder={labels.whatareYouLookingFor}
            navigation={navigation}
            filter={false}
          />
          <FlatList
            data={[1, 2, 3, 4]}
            style={{ flex: 1 }}
            contentContainerStyle={styles.contentContainerStyle}
            keyExtractor={(item, index) => item.toString()}
            renderItem={() => (
              <RestaurantCard
                image={images.newly_opened || images.foodHome}
                restaurantName="Restaurant Name"
                rating={4.8}
                reviewCount={150}
                location="New York City, NY"
                onPress={() => {
                  navigation.navigate('FoodRestaurantInformation');
                  // Handle card press
                }}
                onHeartPress={isFavorite => {
                  console.log('Favorite:', isFavorite);
                }}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </View>
  );
};

export default RestaurantInfo;

const wishlistButton = (wishlist: boolean, top: number) =>
  StyleSheet.create({
    container: {
      backgroundColor: wishlist ? colors.c_F47E20 : colors.transparent,
      padding: 10,
      borderRadius: 100,
      borderWidth: 1,
      borderColor: wishlist ? colors.c_F47E20 : colors.transparent,
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
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
  lowerContainer: {
    flex: 1,
    backgroundColor: colors.white,
    zIndex: 999,
    marginTop: -90,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  restaurantCardContainer: {
    paddingHorizontal: 20,
    marginTop: 35,
    gap: 35,
    flex: 1,
  },
  contentContainerStyle: {
    // marginTop: 35,
    flexGrow: 1,
  },
});
