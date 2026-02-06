import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useMemo } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import colors from '../../../config/colors';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import images from '../../../config/images';
import { useNavigation } from '@react-navigation/native';
import FoodItemCard from '../../../components/foodItemCard/FoodItemCard';
import { useGetOrdersByUserIdQuery } from '../../../redux/services/restaurant.service';
import fonts from '../../../config/fonts';

type OrderItem = {
  id: number;
  orderId: number;
  itemId: number;
  quantity: number;
  status: string;
  item: {
    id: number;
    name: string;
    description?: string;
    price: number;
    category?: string;
    image?: string;
  };
};

type Order = {
  id: number;
  userId: number;
  restaurantId: number;
  subTotal: number;
  totalAmount: number;
  tax: number;
  deliveryFee: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  restaurant: {
    id: number;
    name: string;
    logo?: string;
    location?: string;
  };
  deliveryAddress?: {
    lat: number;
    lng: number;
    location?: string;
  };
};

const MyOrders = () => {
  const navigation = useNavigation<any>();

  const { data: orderResponse, isLoading, refetch } = useGetOrdersByUserIdQuery({});

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch();
    });
    return unsubscribe;
  }, [navigation, refetch]);

  const ordersList = useMemo((): Order[] => {
    const raw = orderResponse?.data ?? orderResponse;
    return Array.isArray(raw) ? raw : [];
  }, [orderResponse]);

  const handleOrderPress = useCallback(
    (order: Order) => {
      navigation.navigate('FoodOrderDetail', { orderId: order.id });
    },
    [navigation]
  );

  const renderOrderItem = useCallback(
    ({ item }: { item: Order }) => {
      const firstItem = item.items?.[0]?.item;
      const imageSrc =
        firstItem?.image
          ? { uri: firstItem.image }
          : item.restaurant?.logo
            ? { uri: item.restaurant.logo }
            : (images.newly_opened ?? images.placeholder);
      const itemSummary =
        item.items?.length > 1
          ? `${item.items[0].item?.name} +${item.items.length - 1} more`
          : firstItem?.name ?? 'Order';
      const deliveryLocation = item.deliveryAddress?.location ?? item.restaurant?.name ?? '';
      return (
        <FoodItemCard
          image={imageSrc as any}
          title={item.restaurant?.name ?? `Order #${item.id}`}
          description={`${item.status} · ${itemSummary}${deliveryLocation ? ` · ${deliveryLocation}` : ''}`}
          price={Number(item.totalAmount) ?? 0}
          rating={0}
          reviewCount={0}
          onPress={() => handleOrderPress(item)}
        />
      );
    },
    [handleOrderPress]
  );

  const keyExtractor = useCallback((item: Order) => String(item.id), []);

  return (
    <WrapperContainer title="My Orders" navigation={navigation} onBackPress={() => navigation.goBack()}>
      {isLoading ? (
        <View style={styles.skeletonWrap}>
          <SkeletonPlaceholder
            borderRadius={10}
            backgroundColor={colors.c_F3F3F3}
            highlightColor={colors.c_DDDDDD}
          >
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.skeletonOrderCard}>
                <View style={styles.skeletonOrderImage} />
                <View style={styles.skeletonOrderBody}>
                  <View style={styles.skeletonOrderTitle} />
                  <View style={styles.skeletonOrderDesc} />
                  <View style={styles.skeletonOrderPrice} />
                </View>
              </View>
            ))}
          </SkeletonPlaceholder>
        </View>
      ) : ordersList.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No orders yet</Text>
        </View>
      ) : (
        <FlatList
          data={ordersList}
          renderItem={renderOrderItem}
          keyExtractor={keyExtractor}
          horizontal={false}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </WrapperContainer>
  );
};

export default MyOrders;

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 20,
    paddingBottom: 50,
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
  },
  skeletonWrap: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
    paddingBottom: 50,
  },
  skeletonOrderCard: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  skeletonOrderImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  skeletonOrderBody: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  skeletonOrderTitle: {
    width: '65%',
    height: 14,
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonOrderDesc: {
    width: '90%',
    height: 12,
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonOrderPrice: {
    width: '30%',
    height: 14,
    borderRadius: 4,
  },
});
