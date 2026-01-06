import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useMemo, useState } from 'react';
import GeneralStyles from '../../../utils/GeneralStyles';
import FoodHeader from '../../../components/foodHeader/FoodHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationProp } from '@react-navigation/native';
import MainCarousel from '../../../components/mainCarousel/MainCarousel';
import { CarouselData } from '../../../constants/Accomodation';
import colors from '../../../config/colors';
import FastImage from 'react-native-fast-image';
import images from '../../../config/images';
import {
  LocateIcon,
  LocateOffIcon,
  LocationEditIcon,
  MapPin,
  Star,
  Truck,
  DollarSign,
} from 'lucide-react-native';
import fonts from '../../../config/fonts';
import SectionHeader from '../../../components/sectionHeader/SectionHeader';
import FoodCardWithFavorite from '../../../components/foodCardWithFavorite/FoodCardWithFavorite';
import FoodCardWithBorder from '../../../components/foodCardWithBorder/FoodCardWithBorder';

const RestaurantInformation = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  const { top } = useSafeAreaInsets();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(1);
  const wishlistButtonStyles = useMemo(() => {
    return wishlistButton(top);
  }, []);
  const contentStyles = useMemo(() => makeContentStyles(top), [top]);

  return (
    <View style={GeneralStyles.flex}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <FoodHeader
          onBackPress={() => navigation?.goBack()}
          onNotificationPress={() => {}}
          onCartPress={() => {}}
          onFavoritePress={() => setIsFavorite(!isFavorite)}
          isFavorite={isFavorite}
        />
      </View>

      <View style={wishlistButtonStyles.carouselContainer}>
        <MainCarousel data={CarouselData} />
      </View>

      <View style={contentStyles.contentCard}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={styles.restaurantInfoContainer}>
            <FastImage
              source={images.user_avatar}
              style={styles.restaurantImage}
            />

            <View>
              <Text style={styles.locationTitleText}>
                Quality Meats Restaurant
              </Text>
              <View style={styles.locationContainer}>
                <MapPin size={16} color={colors.c_F47E20} />
                <Text style={styles.locationText}>New York City, NY 10019</Text>
              </View>
            </View>
          </View>

          {/* Info Cards */}
          <View style={styles.infoCardsContainer}>
            {/* Rating Card */}
            <View style={styles.infoCard}>
              <View style={[styles.iconCircle, styles.orangeCircle]}>
                <Star size={20} color={colors.white} fill={colors.white} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoValue}>4.7</Text>
                <Text style={styles.infoLabel}>Rating</Text>
              </View>
            </View>

            {/* Delivery Card */}
            <View style={styles.infoCard}>
              <View style={[styles.iconCircle, styles.orangeCircle]}>
                <Truck size={20} color={colors.white} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoValue}>30 mins</Text>
                <Text style={styles.infoLabel}>Delivery</Text>
              </View>
            </View>

            {/* Price Card */}
            <View style={styles.infoCard}>
              <View style={[styles.iconCircle, styles.blueCircle]}>
                <DollarSign size={20} color={colors.white} />
              </View>
              <View style={styles.infoTextContainer}>
                <View style={styles.priceContainer}>
                  <Text style={styles.infoValue}>$10</Text>
                </View>
                <Text style={styles.infoLabel}>From just</Text>
              </View>
            </View>
          </View>

          <SectionHeader title="Featured Foods" onSeeAllPress={() => {}} />

          <View>
            <FlatList
              data={[1, 2, 3, 4]}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredContainer}
              renderItem={({ item, index }) => (
                <FoodCardWithFavorite
                  image={images.foodHome}
                  title="Food Name"
                  rating={4.7}
                  reviewCount={150}
                  price={10}
                  onPress={() => navigation.navigate('FoodDetails')}
                />
              )}
            />
          </View>
          <SectionHeader title="Menu" onSeeAllPress={() => {}} />

          <FlatList
            data={[1, 2, 3, 4, 5, 6]}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.menuGridContainer}
            columnWrapperStyle={styles.menuRow}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.menuCardWrapper}>
                <FoodCardWithBorder
                  image={images.foodHome}
                  title="Pretzel Chicken Noodle Soup - Regular"
                  category="Noodles"
                  rating={4.7}
                  price={35}
                  hasFreeship={true}
                  onPress={() => navigation.navigate('FoodDetails')}
                />
              </View>
            )}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default RestaurantInformation;

const makeContentStyles = (top: number) =>
  StyleSheet.create({
    contentCard: {
      flex: 1,
      backgroundColor: colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginTop: -90,
      zIndex: 999,
      gap: 20,
      paddingTop: 35,
      paddingHorizontal: 20,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: top + 50,
      paddingHorizontal: 20,
      paddingTop: 20,
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
  restaurantInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  restaurantImage: {
    width: 65,
    height: 65,
  },
  locationText: {
    fontSize: 16,
    fontFamily: fonts.normal,
  },
  locationTitleText: {
    fontSize: 20,
    fontFamily: fonts.semibold,
    marginBottom: 6,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  infoCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orangeCircle: {
    backgroundColor: colors.c_F47E20,
  },
  blueCircle: {
    backgroundColor: colors.c_0162C0,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.c_2B2B2B,
    marginBottom: 2,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  priceContainer: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  underlineLine: {
    position: 'absolute',
    bottom: 4,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.c_0162C0,
  },
  menuContainer: {
    gap: 16,
  },
  featuredContainer: {
    gap: 12,
    paddingRight: 20,
  },
  featuredCardWrapper: {
    width: 280,
    borderRadius: 12,
  },
  selectedCardWrapper: {
    borderWidth: 2,
    borderColor: colors.c_0162C0,
    borderRadius: 12,
  },
  menuGridContainer: {
    paddingBottom: 20,
  },
  menuRow: {
    justifyContent: 'space-between',
    gap: 12,
  },
  menuCardWrapper: {
    flex: 1,
    marginBottom: 12,
  },
  scrollViewContent: {
    paddingBottom: 60,
  },
});
