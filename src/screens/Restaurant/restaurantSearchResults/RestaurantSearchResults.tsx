import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import { useLazyGetFilteredRestaurantsQuery } from '../../../redux/services/restaurant.service';
import type { RestaurantFilterParams } from '../restaurantFilter/RestaurantFilter';
import images from '../../../config/images';

type RestaurantItem = {
  id?: number;
  name?: string;
  logo?: string;
  description?: string;
  banner?: string;
  deliveryRadius?: string;
  location?: string;
  [key: string]: any;
};

const parseLocation = (loc?: string): string => {
  if (!loc || typeof loc !== 'string') return '';
  try {
    const o = JSON.parse(loc);
    if (o?.city && o?.address) return `${o.address}, ${o.city}`;
    if (o?.address) return o.address;
    if (o?.city) return o.city;
    return '';
  } catch {
    return loc;
  }
};

const RestaurantSearchResults = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const filters = route.params?.filters as RestaurantFilterParams | undefined;

  const [trigger, { data, isLoading, isError }] = useLazyGetFilteredRestaurantsQuery();
  const [restaurantList, setRestaurantList] = useState<RestaurantItem[]>([]);

  useEffect(() => {
    if (!filters) return;
    trigger({
      city: filters.city,
      minRadius: filters.minRadius,
      maxRadius: filters.maxRadius,
      day: filters.day,
      time: filters.time,
      page: filters.page ?? 1,
      limit: filters.limit ?? 10,
    }).then((result) => {
      if (result.data) {
        const body = (result.data as any)?.data;
        const raw = body?.data ?? (result.data as any)?.data?.restaurants ?? (result.data as any)?.restaurants ?? (result.data as any)?.data;
        setRestaurantList(Array.isArray(raw) ? raw : []);
      } else {
        setRestaurantList([]);
      }
    }).catch(() => setRestaurantList([]));
  }, [route.params?.filters]);

  if (!filters) {
    return (
      <WrapperContainer title="Search Results" onBackPress={() => navigation?.goBack()}>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No filters applied. Go back and search.</Text>
        </View>
      </WrapperContainer>
    );
  }

  return (
    <WrapperContainer title="Restaurants" onBackPress={() => navigation?.goBack()}>
      {isLoading && restaurantList.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.c_0162C0} />
        </View>
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Unable to load results. Try again.</Text>
        </View>
      ) : restaurantList.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No restaurants found for your filters.</Text>
        </View>
      ) : (
        <FlatList
          data={restaurantList}
          keyExtractor={(item) => String(item?.id ?? Math.random())}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.cardWrapper}
              onPress={() =>
                navigation.navigate('FoodRestaurantInformation', {
                  id: item?.id,
                  name: item?.name,
                  logo: item?.logo,
                  description: item?.description,
                  banner: item?.banner,
                  createdAt: item?.createdAt,
                  deliveryRadius: item?.deliveryRadius,
                })
              }
              activeOpacity={0.8}
            >
              <View style={styles.cardRow}>
                <Image
                  source={item?.logo ? { uri: item.logo } : (images.placeholder as any)}
                  style={styles.logo}
                  resizeMode="cover"
                />
                <View style={styles.cardBody}>
                  <Text style={styles.restaurantName} numberOfLines={1}>{item?.name ?? 'Restaurant'}</Text>
                  {parseLocation(item?.location) ? (
                    <Text style={styles.restaurantLocation} numberOfLines={1}>{parseLocation(item?.location)}</Text>
                  ) : null}
                  <Text style={styles.restaurantDesc} numberOfLines={2}>{item?.description ?? ''}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </WrapperContainer>
  );
};

export default RestaurantSearchResults;

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 50,
  },
  cardWrapper: {
    marginBottom: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: colors.c_F3F3F3,
  },
  cardBody: { flex: 1, marginLeft: 14 },
  restaurantName: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.black,
    marginBottom: 4,
  },
  restaurantLocation: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginBottom: 2,
  },
  restaurantDesc: {
    fontSize: 13,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.c_666666,
    textAlign: 'center',
  },
});
