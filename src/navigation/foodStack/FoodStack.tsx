import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { StyleSheet } from 'react-native';
import React, { FC } from 'react';
import DummyPage from '../../screens/dummyPage/DummyPage';
import Home from '../../screens/Restaurant/home/Home';
import Wishlists from '../../screens/Restaurant/wishlist/WishList';
import MyOrders from '../../screens/Restaurant/myOrders/MyOrders';
import RestaurantInfo from '../../screens/Restaurant/restaurantInfo/RestaurantInfo';
import FoodDetails from '../../screens/Restaurant/foodDetails/FoodDetails';
import Reviews from '../../screens/Restaurant/reviews/Reviews';
import Cart from '../../screens/Restaurant/cart/Cart';
import MyWallet from '../../screens/Restaurant/myWallet/MyWallet';
import OrderTracking from '../../screens/Restaurant/ordersTracking/OrderTracking';
import Chat from '../../screens/messages/Chat';
import RestaurantInformation from '../../screens/Restaurant/restaurantInformation/RestaurantInformation';
import Checkout from '../../screens/Restaurant/checkout/Checkout';
import TripDetails from '../../screens/Accomodation/tripDetails/TripDetails';
import Notifications from '../../screens/notifications/Notifications';
import Profile from '../../screens/profile/Profile';
const FoodStackNavigator = createNativeStackNavigator();

const FoodStack: FC = () => {
  return (
    <FoodStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <FoodStackNavigator.Screen name="FoodHome" component={Home} />
      <FoodStackNavigator.Screen name="FoodCheckout" component={Checkout} />
      <FoodStackNavigator.Screen
        name="FoodTripDetails"
        component={TripDetails}
      />
      <FoodStackNavigator.Screen
        name="FoodRestaurantInformation"
        component={RestaurantInformation}
      />
      <FoodStackNavigator.Screen name="FoodChat" component={Chat} />
      <FoodStackNavigator.Screen
        name="FoodOrderTracking"
        component={OrderTracking}
      />
      <FoodStackNavigator.Screen name="Profile" component={Profile} />

      <FoodStackNavigator.Screen name="FoodMyWallet" component={MyWallet} />
      <FoodStackNavigator.Screen name="FoodCart" component={Cart} />
      <FoodStackNavigator.Screen name="FoodReviews" component={Reviews} />
      <FoodStackNavigator.Screen name="FoodDetails" component={FoodDetails as any} />
      <FoodStackNavigator.Screen
        name="FoodRestaurantInfo"
        component={RestaurantInfo}
      />
      <FoodStackNavigator.Screen
        name="Notifications"
        component={Notifications}
      />
      <FoodStackNavigator.Screen name="FoodMyOrders" component={MyOrders} />
      <FoodStackNavigator.Screen name="FoodWishlists" component={Wishlists} />
      <FoodStackNavigator.Screen name="Dummy" component={DummyPage} />
    </FoodStackNavigator.Navigator>
  );
};

export default FoodStack;

const styles = StyleSheet.create({});
