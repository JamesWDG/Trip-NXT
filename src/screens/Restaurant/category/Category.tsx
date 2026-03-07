import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import GeneralStyles from '../../../utils/GeneralStyles';
import { useLazyGetItemsByCategoryQuery } from '../../../redux/services/restaurant.service';
import { MenuItem } from '../../../constants/Food';
import { ShowToast } from '../../../config/constants';
import FoodCardWithBorder from '../../../components/foodCardWithBorder/FoodCardWithBorder';
import images from '../../../config/images';
import { useLazyGetAccomodationItemsByCategoryQuery } from '../../../redux/services/hotel.service';
import { RecommendedCard } from '../../dummyPage/DummyPage';
import CategorySkeleton from '../../../components/categorySkeleton/CategorySkeleton';
import { getLocation } from '../../../utils/loaction';

type HotelItem = {
  avgRating?: number;
  id?: number;
  name?: string;
  images?: string[];
  rentPerDay?: number;
  location?: { city?: string; state?: string; country?: string };
};

const Category = ({ navigation, route }: { navigation: any; route?: any }) => {
  const { top } = useSafeAreaInsets();
  const headerStyles = useMemo(() => makeHeaderStyles(top), [top]);
  const [getItemsByCategory] = useLazyGetItemsByCategoryQuery();
  const [getAccomodationItemsByCategory] =
    useLazyGetAccomodationItemsByCategoryQuery();
  const [items, setItems] = useState<MenuItem[] | HotelItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItemsByCategory = async () => {
    try {
      const location = await getLocation();
      setLoading(true);
      const res = await getItemsByCategory({
        category: route.params?.category,
        restaurant: route.params?.restaurant,
        lat: location?.latitude,
        lng: location?.longitude,
      }).unwrap();
      setItems(res.data.items);
    } catch (error) {
      console.log('error ===>', error);
      ShowToast('error', 'Unable to fetch items by category');
    } finally {
      setLoading(false);
    }
  };

  const fetchAccomodationItemsByCategory = async () => {
    try {
      const location = await getLocation();
      setLoading(true);
      const res = await getAccomodationItemsByCategory({
        type: route.params?.category.toLowerCase() as
          | 'standard'
          | 'luxury'
          | 'budget',
        lat: location?.latitude,
        lng: location?.longitude,
      }).unwrap();
      setItems(res.data);
    } catch (error) {
      console.log('error ===>', error);
      ShowToast('error', 'Unable to fetch items by category');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (route.params?.type === 'accomodation') {
      fetchAccomodationItemsByCategory();
    } else {
      fetchItemsByCategory();
    }
  }, [route.params]);

  return (
    <View style={[GeneralStyles.flex, { backgroundColor: colors.white }]}>
      {/* Interactive Header */}
      <View style={[headerStyles.container, styles.header]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#F47E20', '#EE4026']}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <ChevronLeft size={24} color={colors.white} />
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {route.params?.category}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content area */}
      <View style={styles.content}>
        {loading ? (
          <CategorySkeleton />
        ) : (
          <FlatList<MenuItem | HotelItem>
            data={items as (MenuItem | HotelItem)[]}
            numColumns={route.params?.type === 'accomodation' ? 1 : 2}
            keyExtractor={item => String(item.id ?? '')}
            columnWrapperStyle={
              route.params?.type === 'accomodation'
                ? undefined
                : styles.columnWrapper
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              if (route.params?.type === 'accomodation') {
                const hotel = item as HotelItem;
                return (
                  <View style={{ marginBottom: 12 }}>
                    <RecommendedCard
                      image={
                        hotel?.images?.[0]
                          ? { uri: hotel.images[0] }
                          : images.recommended_accomodation
                      }
                      title={hotel?.name ?? 'Hotel'}
                      description={`$${Number(hotel?.rentPerDay ?? 0).toFixed(
                        0,
                      )}/night`}
                      price={Number(hotel?.rentPerDay) ?? 0}
                      rating={(item?.avgRating as number) ?? 0}
                      location={
                        hotel?.location
                          ? [
                              hotel.location.city,
                              hotel.location.state,
                              hotel.location.country,
                            ]
                              .filter(Boolean)
                              .join(', ')
                          : '—'
                      }
                      onPress={() =>
                        navigation.navigate('HotelDetails', { hotel })
                      }
                    />
                  </View>
                );
              }
              const menuItem = item as MenuItem;
              return (
                <View style={styles.cardWrapper}>
                  <FoodCardWithBorder
                    cb={fetchItemsByCategory}
                    image={menuItem.image || images.foodHome}
                    title={menuItem.name}
                    category={menuItem.category || 'Food'}
                    rating={0}
                    price={menuItem.price}
                    id={menuItem?.id}
                    hasFreeship={false}
                    onPress={() =>
                      navigation.navigate('FoodDetails', {
                        id: String(menuItem.id),
                        name: menuItem.name,
                        price: menuItem.price,
                        image: menuItem.image || '',
                        description: menuItem.description || '',
                        category: menuItem.category || '',
                        toppings: [],
                        wishlistId: menuItem.wishlistId ?? null,
                      })
                    }
                    isFavorite={!!menuItem.wishlistId}
                  />
                </View>
              );
            }}
          />
        )}
      </View>
    </View>
  );
};

export default Category;

const makeHeaderStyles = (top: number) =>
  StyleSheet.create({
    container: {
      paddingTop: top + 10,
      paddingBottom: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      backgroundColor: colors.white,
      borderBottomWidth: 1,
      borderBottomColor: colors.c_F3F3F3,
    },
  });

const styles = StyleSheet.create({
  header: {
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradientButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontFamily: fonts.semibold,
    color: colors.c_2B2B2B,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  placeholder: {
    width: 40,
    height: 40,
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  columnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  cardWrapper: {
    flex: 1,
    maxWidth: '48%',
  },
});
