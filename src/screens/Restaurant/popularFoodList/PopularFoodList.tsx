import {
  FlatList,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NavigationProp } from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import GeneralStyles from '../../../utils/GeneralStyles';
import RestaurantHeader from '../../../components/RestaurantHeader/ReataurantHeader';
import FoodCardWithBorder from '../../../components/foodCardWithBorder/FoodCardWithBorder';
import images from '../../../config/images';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import { useLazyGetPopularMenusQuery } from '../../../redux/services/restaurant.service';
import { width } from '../../../config/constants';

const PopularFoodList = ({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) => {
  const [items, setItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [popularMenusGet] = useLazyGetPopularMenusQuery();

  const fetchMenus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await popularMenusGet(50).unwrap();
      setItems(res.data?.items ?? []);
    } catch (_) {}
    finally {
      setLoading(false);
    }
  }, [popularMenusGet]);

  useEffect(() => {
    fetchMenus();
  }, []);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.trim().toLowerCase();
    return items.filter(
      item =>
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)),
    );
  }, [items, searchQuery]);

  const openDetails = useCallback(
    (item: any) => {
      navigation.navigate('FoodDetails', {
        id: String(item.id),
        name: item.name,
        price: item.price,
        image: item.image || '',
        description: item.description || '',
        category: item.category || '',
        toppings: [],
      });
    },
    [navigation],
  );

  return (
    <View style={GeneralStyles.flex}>
      <View style={styles.headerContainer}>
        <RestaurantHeader
          navigation={navigation}
          onPress={() => {}}
          onBackPress={() => navigation.goBack()}
  
        />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, category..."
          placeholderTextColor={colors.c_666666}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <View style={styles.skeletonContainer}>
          <SkeletonPlaceholder
            borderRadius={10}
            backgroundColor={colors.c_F3F3F3}
            highlightColor={colors.c_DDDDDD}
          >
            <View style={styles.skeletonGrid}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <View key={i} style={styles.skeletonCard}>
                  <View style={styles.skeletonImage} />
                  <View style={styles.skeletonTitle} />
                  <View style={styles.skeletonCategory} />
                  <View style={styles.skeletonPrice} />
                </View>
              ))}
            </View>
          </SkeletonPlaceholder>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          numColumns={2}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <FoodCardWithBorder
                image={item.image || images.foodHome}
                title={item.name}
                category={item.category || 'Food'}
                rating={0}
                price={item.price}
                hasFreeship={false}
                onPress={() => openDetails(item)}
              />
            </View>
          )}
        />
      )}
    </View>
  );
};

export default PopularFoodList;

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 20,
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
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
    gap: 12,
  },
  cardWrapper: {
    flex: 1,
    marginBottom: 12,
  },
  skeletonContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  skeletonCard: {
    width: (width - 52) / 2,
    marginBottom: 12,
  },
  skeletonImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 10,
  },
  skeletonTitle: {
    width: '85%',
    height: 14,
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonCategory: {
    width: '50%',
    height: 12,
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonPrice: {
    width: '40%',
    height: 14,
    borderRadius: 4,
  },
});
