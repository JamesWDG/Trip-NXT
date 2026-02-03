import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
import colors from '../../../config/colors';
import { RecommendedCard } from '../../dummyPage/DummyPage';
import images from '../../../config/images';
import AccomodationTabButtons from '../../../components/accomodationTabButtons/AccomodationTabButtons';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import { useNavigation } from '@react-navigation/native';
import FoodItemCard from '../../../components/foodItemCard/FoodItemCard';
import { useGetOrdersByUserIdQuery } from '../../../redux/services/restaurant.service';
import { useGetHotelBookingsForUserQuery } from '../../../redux/services/hotel.service';
import fonts from '../../../config/fonts';

const TAB_INDEX_HOTELS = 0;
const TAB_INDEX_FOODS = 1;

type HotelBookingItem = {
  id: number;
  hotelId: number;
  userId: number;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  status: string;
  hotel?: {
    id: number;
    name: string;
    images?: string[];
    rentPerDay?: number;
    rentPerHour?: number;
    location?: { city?: string; state?: string; country?: string };
    description?: string;
    numberOfBeds?: number;
    numberOfBathrooms?: number;
    numberOfGuests?: number;
    owner?: { name?: string; profilePicture?: string };
    features?: unknown[];
  };
};

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

const MyBookings = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState(TAB_INDEX_HOTELS);

  const { data: orderResponse, isLoading: isLoadingOrders, refetch: refetchOrders } = useGetOrdersByUserIdQuery(
    {},
    { skip: activeTab !== TAB_INDEX_FOODS }
  );
  const { data: hotelBookingsData, isLoading: isLoadingHotels, refetch: refetchHotelBookings } = useGetHotelBookingsForUserQuery(
    undefined,
    { skip: activeTab !== TAB_INDEX_HOTELS }
  );

  const ordersGrouped = useMemo((): Order[] => {
    const raw = orderResponse?.data ?? orderResponse;
    return Array.isArray(raw) ? raw : [];
  }, [orderResponse]);

  const handleTabChange = useCallback((index: number) => {
    setActiveTab(index);
    if (index === TAB_INDEX_HOTELS) {
      refetchHotelBookings();
    } else if (index === TAB_INDEX_FOODS) {
      refetchOrders();
    }
  }, [refetchHotelBookings, refetchOrders]);

  const hotelBookingsList = useMemo((): HotelBookingItem[] => {
    const raw = hotelBookingsData?.data ?? hotelBookingsData;
    return Array.isArray(raw) ? raw : [];
  }, [hotelBookingsData]);

  const handleHotelBookingPress = useCallback(
    (booking: HotelBookingItem) => {
      navigation.navigate('HotelBookingDetail', { bookingId: booking.id });
    },
    [navigation]
  );

  const renderHotelItem = useCallback(
    ({ item }: { item: HotelBookingItem }) => {
      const hotel = item.hotel;
      const imageSrc =
        hotel?.images?.[0] ? { uri: hotel.images[0] } : (images.recommended_accomodation as any);
      const locationStr = hotel?.location
        ? [hotel.location.city, hotel.location.state, hotel.location.country].filter(Boolean).join(', ')
        : '—';
      return (
        <RecommendedCard
          image={imageSrc}
          title={hotel?.name ?? 'Hotel'}
          description={`$${Number(hotel?.rentPerDay ?? 0).toFixed(0)}/night`}
          price={Number(item.totalAmount) ?? 0}
          rating={4.5}
          location={locationStr || '—'}
          onPress={() => handleHotelBookingPress(item)}
        />
      );
    },
    [handleHotelBookingPress]
  );

  const handleOrderPress = useCallback(
    (order: Order) => {
      navigation.navigate('OrderDetail', { orderId: order.id });
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

  const keyExtractorHotels = useCallback(
    (item: HotelBookingItem) => String(item.id),
    []
  );
  const keyExtractorOrders = useCallback(
    (item: Order) => String(item.id),
    []
  );



  return (
    <WrapperContainer title="My Bookings" navigation={navigation}
 
    onBackPress={()=> navigation.goBack()}
    >
      <View style={styles.mainContainer}>
        <AccomodationTabButtons
          data={['Hotels', 'Foods']}
          activeIndex={activeTab}
          onTabChange={handleTabChange}
        />
      </View>

      {activeTab === TAB_INDEX_HOTELS && (
        <>
          {isLoadingHotels ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={colors.c_0162C0} />
            </View>
          ) : hotelBookingsList.length === 0 ? (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No hotel bookings yet</Text>
            </View>
          ) : (
            <FlatList
              data={hotelBookingsList}
              renderItem={renderHotelItem}
              keyExtractor={keyExtractorHotels}
              horizontal={false}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}

      {activeTab === TAB_INDEX_FOODS && (
        <>
          {isLoadingOrders ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={colors.c_0162C0} />
            </View>
          ) : ordersGrouped.length === 0 ? (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No food orders yet</Text>
            </View>
          ) : (
            <FlatList
              data={ordersGrouped}
              renderItem={renderOrderItem}
              keyExtractor={keyExtractorOrders}
              horizontal={false}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}
    </WrapperContainer>
  );
};

export default MyBookings;

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  listContent: {
    paddingHorizontal: 20,
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
});
