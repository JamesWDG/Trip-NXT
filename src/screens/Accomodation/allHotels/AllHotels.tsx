import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import images from '../../../config/images';
import { RecommendedCard } from '../../dummyPage/DummyPage';
import { useLazyGetFilteredHotelsQuery } from '../../../redux/services/hotel.service';

const PAGE_SIZE = 10;

type HotelItem = {
  id?: number;
  name?: string;
  images?: string[];
  rentPerDay?: number;
  location?: { city?: string; state?: string; country?: string };
};

const AllHotels = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [trigger] = useLazyGetFilteredHotelsQuery();
  const fetchingRef = useRef(false);

  const fetchPage = useCallback(
    async (pageNum: number, append: boolean) => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);
      try {
        const res = await trigger({
          city: searchQuery.trim() || undefined,
          page: pageNum,
          limit: PAGE_SIZE,
        }).unwrap();
        const body = (res as any)?.data;
        const list = body?.data ?? (res as any)?.data ?? [];
        const nextList = Array.isArray(list) ? list : [];
        const total = body?.totalPages ?? 1;
        setTotalPages(total);
        if (append) {
          setHotels((prev) => (pageNum === 1 ? nextList : [...prev, ...nextList]));
        } else {
          setHotels(nextList);
        }
        setPage(pageNum);
      } catch {
        if (pageNum === 1) setHotels([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        fetchingRef.current = false;
      }
    },
    [searchQuery, trigger]
  );

  useEffect(() => {
    setPage(1);
    fetchPage(1, false);
  }, [searchQuery]);

  const handleSearchSubmit = useCallback(() => {
    setSearchQuery(searchInput.trim());
  }, [searchInput]);

  const loadMore = useCallback(() => {
    if (loadingMore || loading || page >= totalPages) return;
    fetchPage(page + 1, true);
  }, [loadingMore, loading, page, totalPages, fetchPage]);

  const handleHotelPress = useCallback(
    (hotel: HotelItem) => {
      navigation.navigate('HotelDetails', { hotel });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: HotelItem }) => {
      const imageSrc = item?.images?.[0]
        ? { uri: item.images[0] }
        : (images.recommended_accomodation as any);
      const locationStr = item?.location
        ? [item.location.city, item.location.state, item.location.country]
            .filter(Boolean)
            .join(', ')
        : '—';
      return (
        <View style={styles.cardItem}>
          <RecommendedCard
            image={imageSrc}
            title={item?.name ?? 'Hotel'}
            description={`$${Number(item?.rentPerDay ?? 0).toFixed(0)}/night`}
            price={Number(item?.rentPerDay ?? 0)}
            rating={4.5}
            location={locationStr}
            onPress={() => handleHotelPress(item)}
          />
        </View>
      );
    },
    [handleHotelPress]
  );

  if (loading && hotels.length === 0) {
    return (
      <WrapperContainer
        title="Hotels"
        navigation={navigation}
        onBackPress={() => navigation.goBack()}
      >
        <View style={styles.searchWrap}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by city..."
            placeholderTextColor={colors.c_666666}
            value={searchInput}
            onChangeText={setSearchInput}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
        </View>
        <View style={styles.skeletonWrap}>
          <SkeletonPlaceholder
            borderRadius={10}
            backgroundColor={colors.c_F3F3F3}
            highlightColor={colors.c_DDDDDD}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <View key={i} style={styles.skeletonCard}>
                <View style={styles.skeletonImage} />
                <View style={styles.skeletonBody}>
                  <View style={styles.skeletonTitle} />
                  <View style={styles.skeletonDesc} />
                  <View style={styles.skeletonMeta} />
                </View>
              </View>
            ))}
          </SkeletonPlaceholder>
        </View>
      </WrapperContainer>
    );
  }

  return (
    <WrapperContainer
      title="Hotels"
      navigation={navigation}
      onBackPress={() => navigation.goBack()}
    >
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by city..."
          placeholderTextColor={colors.c_666666}
          value={searchInput}
          onChangeText={setSearchInput}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
        />
      </View>
      {hotels.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>
            {searchQuery ? 'No hotels found for this search.' : 'No hotels found.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={hotels}
          renderItem={renderItem}
          keyExtractor={(item) => String(item?.id ?? Math.random())}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <Text style={styles.footerLoaderText}>Loading more...</Text>
              </View>
            ) : null
          }
        />
      )}
    </WrapperContainer>
  );
};

export default AllHotels;

const styles = StyleSheet.create({
  searchWrap: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: colors.white,
  },
  searchInput: {
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.c_F3F3F3,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 50,
  },
  cardItem: {
    marginBottom: 20,
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
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  footerLoaderText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  skeletonWrap: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  skeletonCard: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  skeletonImage: {
    width: 120,
    height: 150,
    borderRadius: 12,
  },
  skeletonBody: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  skeletonTitle: {
    width: '70%',
    height: 16,
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonDesc: {
    width: '50%',
    height: 12,
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonMeta: {
    width: '40%',
    height: 12,
    borderRadius: 4,
  },
});
