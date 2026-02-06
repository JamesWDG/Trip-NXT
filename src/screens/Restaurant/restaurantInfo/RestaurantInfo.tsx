import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
import GeneralStyles from '../../../utils/GeneralStyles';
import { NavigationProp } from '@react-navigation/native';
import RestaurantHeader from '../../../components/RestaurantHeader/ReataurantHeader';
import MainCarousel from '../../../components/mainCarousel/MainCarousel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import SearchWithFilters from '../../../components/searchWithFilters/SearchWithFilters';
import labels from '../../../config/labels';
import images from '../../../config/images';
import FastImage from 'react-native-fast-image';
import { useLazyRestaurantGetQuery } from '../../../redux/services/restaurant.service';
import RestaurantListSkeleton from '../../../components/restaurantListSkeleton/RestaurantListSkeleton';

const getRestaurantImage = (item: any) => {
  const logo = item?.logo;
  const banner = item?.banner;
  if (logo && typeof logo === 'string' && logo.startsWith('http')) return { uri: logo };
  if (banner && typeof banner === 'string' && banner.startsWith('http')) return { uri: banner };
  return images.placeholder;
};

const PAGE_SIZE = 10;

const RestaurantInfo = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  const { top } = useSafeAreaInsets();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [restaurantGet] = useLazyRestaurantGetQuery();

  const loadRestaurants = useCallback(
    async (pageNum: number, append: boolean) => {
      if (pageNum > totalPages && append) return;
      if (append) setLoadingMore(true);
      else setLoading(true);
      try {
        const res = await restaurantGet({ page: pageNum, limit: PAGE_SIZE }).unwrap();
        const list = res.data?.restaurants ?? [];
        const total = res.data?.total ?? 0;
        setRestaurants(prev => (append ? [...prev, ...list] : list));
        setTotalPages(Math.ceil(total / PAGE_SIZE) || 1);
        setPage(pageNum);
      } catch (_) {}
      finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [restaurantGet, totalPages],
  );

  React.useEffect(() => {
    loadRestaurants(1, false);
  }, []);

  const handleEndReached = useCallback(() => {
    if (loading || loadingMore || page >= totalPages) return;
    loadRestaurants(page + 1, true);
  }, [loading, loadingMore, page, totalPages, loadRestaurants]);

  const wishlistButtonStyles = useMemo(() => wishlistButton(false, top), [top]);

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
          {loading && restaurants.length === 0 ? (
            <RestaurantListSkeleton />
          ) : (
            <FlatList
              data={restaurants}
              style={styles.list}
              contentContainerStyle={styles.contentContainerStyle}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.cardRow}
                  onPress={() => navigation.navigate('FoodRestaurantInformation', {
                    id: item.id,
                    name: item.name,
                    logo: item.logo,
                    description: item.description,
                    banner: item.banner,
                    createdAt: item.createdAt,
                    deliveryRadius: item.deliveryRadius,
                  })}
                  activeOpacity={0.8}
                >
                  <View style={styles.imageWrap}>
                    <FastImage
                      source={getRestaurantImage(item)}
                      style={styles.cardImage}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={styles.cardTextWrap}>
                    <Text numberOfLines={1} style={styles.cardTitle}>
                      {item?.name || 'Restaurant'}
                    </Text>
                    <Text numberOfLines={2} style={styles.cardDesc}>
                      {item?.description?.trim() || 'View menu'}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color={colors.c_0162C0} style={styles.footerLoader} /> : null}
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.3}
              showsVerticalScrollIndicator={false}
            />
          )}
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
    flexGrow: 1,
    paddingBottom: 24,
  },
  list: { flex: 1 },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  imageWrap: {
    width: 72,
    height: 72,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.c_F3F3F3,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardTextWrap: {
    flex: 1,
    marginLeft: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.black,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  footerLoader: { paddingVertical: 16 },
});
