import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useCallback, useMemo } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import images from '../../../config/images';
import { RecommendedCard } from '../../dummyPage/DummyPage';
import { useLazyGetFilteredHotelsQuery } from '../../../redux/services/hotel.service';
import type { AccomodationCard } from '../../../constants/Accomodation';

export type HotelFilterParams = {
  city?: string;
  checkInDate?: string;
  checkOutDate?: string;
  priceMin?: number;
  priceMax?: number;
  roomType?: string;
  guests?: number;
  rooms?: number;
  page?: number;
  limit?: number;
};

const HotelSearchResults = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const filters = route?.params?.filters as HotelFilterParams | undefined;

  const [trigger, { data, isLoading, isError }] = useLazyGetFilteredHotelsQuery();

  useEffect(() => {
    if (filters) {
      trigger(filters);
    }
  }, [filters]);

  // API response: { success, message, data: { data: hotels[], total, page, limit, totalPages } }
  const hotelList = useMemo(() => {
    const raw = data?.data?.data ?? data?.data ?? data;
    return Array.isArray(raw) ? raw : [];
  }, [data]);

  const handleHotelPress = useCallback(
    (hotel: AccomodationCard) => {
      navigation.navigate('HotelDetails', { hotel });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      const imageSrc = item.images?.[0]
        ? { uri: item.images[0] }
        : (images.recommended_accomodation as any);
      const locationStr = item.location
        ? [item.location.city, item.location.state, item.location.country]
            .filter(Boolean)
            .join(', ')
        : '—';
      return (
        <RecommendedCard
          image={imageSrc}
          title={item.name ?? 'Hotel'}
          description={`$${Number(item.rentPerDay ?? 0).toFixed(0)}/night`}
          price={Number(item.rentPerDay ?? 0)}
          rating={4.5}
          location={locationStr}
          onPress={() => handleHotelPress(item as AccomodationCard)}
        />
      );
    },
    [handleHotelPress]
  );

  const keyExtractor = useCallback((item: any) => String(item.id), []);

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
    <WrapperContainer title="Search Results" onBackPress={() => navigation?.goBack()}>
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.c_0162C0} />
        </View>
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Unable to load results. Try again.</Text>
        </View>
      ) : hotelList.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No hotels found for your filters.</Text>
        </View>
      ) : (
        <FlatList
          data={hotelList}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </WrapperContainer>
  );
};

export default HotelSearchResults;

const styles = StyleSheet.create({
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
  listContent: {
    paddingHorizontal: 20,
    gap: 20,
    paddingBottom: 50,
    paddingTop: 10,
  },
});
