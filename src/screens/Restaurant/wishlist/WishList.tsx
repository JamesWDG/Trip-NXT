import { FlatList, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import colors from '../../../config/colors';
import AccomodationTabButtons from '../../../components/accomodationTabButtons/AccomodationTabButtons';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import { useNavigation } from '@react-navigation/native';
import FoodItemCard from '../../../components/foodItemCard/FoodItemCard';
import {
  useDeleteFromWishlistMutation,
  useLazyGetWishlistQuery,
} from '../../../redux/services/wishlist.service';
import { ShowToast } from '../../../config/constants';
import WishlistSkeleton from '../../../components/wishlistSkeleton/WishlistSkeleton';

const Wishlists = () => {
  const navigation = useNavigation<any>();
  const [getWishlist] = useLazyGetWishlistQuery();
  const [hotelWishlist, setHotelWishlist] = useState<any[]>([]);
  const [foodWishlist, setFoodWishlist] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<0 | 1>(0);
  const [loading, setLoading] = useState(true);
  const [deleteWishlist] = useDeleteFromWishlistMutation();

  const deleteFromWishlist = async (type: 'hotel' | 'dish', id: number) => {
    let payload: { id?: number; type?: 'hotel' | 'dish' } = {};
    if (type === 'hotel') {
      payload.id = id;
      payload.type = 'hotel';
    } else {
      payload.id = id;
      payload.type = 'dish';
    }
    try {
      const res = await deleteWishlist(
        payload as { id: number; type: 'hotel' | 'dish' },
      ).unwrap();
      await fetchWishList();
    } catch (error) {
      console.log('error ===>', error);
      ShowToast('error', 'Unable to delete from wishlist');
    }
  };

  const fetchWishList = async () => {
    try {
      if (hotelWishlist.length < 1 && foodWishlist.length < 1) {
        setLoading(true);
      }
      const res = await getWishlist({}).unwrap();
      console.log('res ===>', res);
      if (res.success) {
        const foodList = res.data.wishlists.filter(
          (item: any) => item.dishId !== null,
        );
        const hotelList = res.data.wishlists.filter(
          (item: any) => item.hotelId !== null,
        );
        setFoodWishlist(foodList);
        setHotelWishlist(hotelList);
      }
    } catch (error) {
      console.log('error ===>', error);
    } finally {
      setLoading(false);
    }
  };

  // console.log('hotelWishlist ===>', hotelWishlist)

  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      fetchWishList();
    });
    return subscribe;
  }, []);

  if (loading) {
    return (
      <WrapperContainer
        onBackPress={() => navigation.goBack()}
        title="Wishlists"
        navigation={navigation}
      >
        <WishlistSkeleton />
      </WrapperContainer>
    );
  }

  return (
    <WrapperContainer
      onBackPress={() => navigation.goBack()}
      title="Wishlists"
      navigation={navigation}
    >
      <View
        style={{
          paddingTop: 30,
          paddingHorizontal: 20,
          marginBottom: 20,
          // backgroundColor: 'red',
        }}
      >
        <AccomodationTabButtons
          activeIndex={activeTab}
          onTabChange={index => setActiveTab(index as 0 | 1)}
          data={['Hotels', 'Foods']}
        />
        {/* <SearchWithFilters placeholder={labels.whatareYouLookingFor} /> */}
      </View>

      <View>
        <FlatList
          data={activeTab === 0 ? hotelWishlist : foodWishlist}
          renderItem={({ item }) => (
            <FoodItemCard
              image={{ uri: item.hotel?.images[0] || item.dish?.image }}
              title={item?.hotel?.name || item?.dish?.name}
              description={item?.hotel?.description || item?.dish?.description}
              price={item?.hotel?.rentPerDay || item?.dish?.price}
              rating={4.5}
              reviewCount={10}
              onPress={() =>
                item.hotel
                  ? navigation.navigate('HotelDetails', { hotel: item.hotel })
                  : navigation.navigate('Food', {
                      screen: 'FoodDetails',
                      params: {
                        id: String(item.dish?.id),
                        name: item.dish?.name,
                        price: item.dish?.price,
                        image: item.dish?.image || '',
                        description: item.dish?.description || '',
                        category: item.dish?.category || '',
                        toppings: item.dish?.toppings || [],
                        wishlistId: item.wishlistId || null,
                        restaurant: item.dish?.restaurant,
                      },
                    })
              }
              isFavorite={true}
              onRemove={() =>
                deleteFromWishlist(
                  activeTab === 0 ? 'hotel' : 'dish',
                  activeTab === 0 ? item.hotel?.id : item.dish?.id,
                )
              }
            />
          )}
          //   keyExtractor={item => item.id}
          horizontal={false}
          contentContainerStyle={styles.hotelForYou}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </WrapperContainer>
  );
};

export default Wishlists;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.c_0162C0,
    flex: 1,
  },
  scrollViewContent: {
    backgroundColor: colors.white,
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // paddingHorizontal: 20,
  },
  hotelForYou: {
    paddingHorizontal: 20,
    gap: 20,
    paddingBottom: 50,
  },
});
