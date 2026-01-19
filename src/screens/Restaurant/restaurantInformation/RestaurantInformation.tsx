import { FlatList, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { FC, useEffect, useMemo, useState } from 'react';
import GeneralStyles from '../../../utils/GeneralStyles';
import FoodHeader from '../../../components/foodHeader/FoodHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationProp, ParamListBase, RouteProp } from '@react-navigation/native';
import MainCarousel from '../../../components/mainCarousel/MainCarousel';
import colors from '../../../config/colors';
import FastImage from 'react-native-fast-image';
import images from '../../../config/images';
import {
  MapPin,
  Star,
  Truck,
  DollarSign,
} from 'lucide-react-native';
import fonts from '../../../config/fonts';
import SectionHeader from '../../../components/sectionHeader/SectionHeader';
import FoodCardWithFavorite from '../../../components/foodCardWithFavorite/FoodCardWithFavorite';
import FoodCardWithBorder from '../../../components/foodCardWithBorder/FoodCardWithBorder';
import { useLazyRestaurantGetMenuQuery } from '../../../redux/services/restaurant.service';
import { height, ShowToast, width } from '../../../config/constants';
import { RestaurantMenu } from '../../../constants/Food';
import RestaurantInformationSkeleton from '../../../components/restaurantInformationSkeleton/RestaurantInformationSkeleton';

const RestaurantInformation: FC<{
  navigation: NavigationProp<ParamListBase, string>;
  route: RouteProp<{
    params: {
      id: string;
      name: string;
      logo: string;
      banner: string;
    }
  }>
}> = ({
  navigation,
  route,
}) => {
    const { top } = useSafeAreaInsets();
    const [isFavorite, setIsFavorite] = useState(false);
    const wishlistButtonStyles = useMemo(() => {
      return wishlistButton(top);
    }, []);
    const contentStyles = useMemo(() => makeContentStyles(top), [top]);
    const [getRestaurantMenu] = useLazyRestaurantGetMenuQuery();
    const [restaurantMenu, setRestaurantMenu] = useState<RestaurantMenu | null>({
      banner: route.params?.banner,
      cheapestItem: {
        id: 0,
        name: '',
        description: '',
        image: '',
        category: '',
        isActive: 0,
        price: 0,
        toppings: []
      },
      deliveryRadius: '',
      description: '',
      id: 0,
      isActive: false,
      location: '',
      logo: route.params?.logo,
      menues: [],
      name: route.params?.name,
      ownerId: 0,
      phoneNumber: '',
      timings: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const fetchRestaurantMenu = async () => {
      try {
        setIsLoading(true);
        const res = await getRestaurantMenu(parseInt(route.params.id)).unwrap();
        console.log('restaurant menu response ===>', res);
        setRestaurantMenu(res.data);
      } catch (error) {
        console.log('restaurant menu error ===>', error, route.params.id);
        ShowToast('error', 'Unable to fetch restaurant menu')
      } finally {
        setIsLoading(false);
      }
    }

    useEffect(() => {
      const subscribe = navigation.addListener('focus', () => {
        fetchRestaurantMenu();
      })
      return () => {
        subscribe();
      }
    }, [route.params])

    if (isLoading) {
      return (
        <View style={GeneralStyles.flex}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <FoodHeader
              onBackPress={() => navigation?.goBack()}
              onNotificationPress={() => { }}
              onCartPress={() => { }}
              onFavoritePress={() => setIsFavorite(!isFavorite)}
              isFavorite={isFavorite}
            />
          </View>
          <RestaurantInformationSkeleton />
        </View>
      );
    }

    return (
      <View style={GeneralStyles.flex}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <FoodHeader
            onBackPress={() => navigation?.goBack()}
            onNotificationPress={() => { }}
            onCartPress={() => { }}
            onFavoritePress={() => setIsFavorite(!isFavorite)}
            isFavorite={isFavorite}
          />
        </View>

        <View style={wishlistButtonStyles.carouselContainer}>
          {/* <MainCarousel data={[route.params?.banner, route.params?.logo]} /> */}
          <ImageBackground
            source={{ uri: restaurantMenu?.banner as string } as any}
            style={styles.imageBackground}
            imageStyle={styles.imageStyle}
            resizeMode="cover"
          ></ImageBackground>
        </View>

        <View style={contentStyles.contentCard}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            <View style={styles.restaurantInfoContainer}>
              <FastImage
                source={{ uri: restaurantMenu?.logo as string }}
                style={styles.restaurantImage}
              />

              <View>
                <Text style={styles.locationTitleText}>
                  {restaurantMenu?.name}
                </Text>
                <View style={styles.locationContainer}>
                  <MapPin size={16} color={colors.c_F47E20} />
                  <Text style={styles.locationText}>{restaurantMenu?.location ? JSON.parse(restaurantMenu?.location as string)?.address : ''}</Text>
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
                    <Text style={styles.infoValue}>${restaurantMenu?.cheapestItem?.price || 0}</Text>
                  </View>
                  <Text style={styles.infoLabel}>From just</Text>
                </View>
              </View>
            </View>

            <SectionHeader title="Featured Foods" onSeeAllPress={() => { }} />

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
            <SectionHeader title="Menu" onSeeAllPress={() => { }} />

            {restaurantMenu?.menues?.map((section, sectionIndex) => (
              <View key={sectionIndex} style={styles.menuSection}>
                <Text style={styles.sectionHeaderText}>{section.title}</Text>
                <FlatList
                  data={section.data}
                  numColumns={2}
                  scrollEnabled={false}
                  contentContainerStyle={styles.menuGridContainer}
                  columnWrapperStyle={styles.menuRow}
                  keyExtractor={(item, index) => `${sectionIndex}-${item.id || index}`}
                  renderItem={({ item }) => (
                    <View style={styles.menuCardWrapper}>
                      <FoodCardWithBorder
                        image={item.image || images.foodHome}
                        title={item.name}
                        category={item.category}
                        rating={4.7}
                        price={item.price}
                        hasFreeship={true}
                        onPress={() => navigation.navigate('FoodDetails', { id: item.id, category: item.category, name: item.name, price: item.price, image: item.image, description: item.description, toppings: item.toppings || [] })}
                      />
                    </View>
                  )}
                />
              </View>
            ))}
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
    borderRadius: 65 / 2,
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
    // paddingBottom: 20,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    // marginBottom: 12,
  },
  menuCardWrapper: {
    flex: 1,
    maxWidth: '48%',
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionHeaderText: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 16,
    marginTop: 8,
  },
  scrollViewContent: {
    paddingBottom: 60,
  },
  imageStyle: {
    width: width * 1,
    height: height * 0.4,
    borderRadius: 10,
  },
  imageBackground: {
    height: height * 0.4,
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
