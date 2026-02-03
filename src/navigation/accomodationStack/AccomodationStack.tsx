import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import DummyPage from '../../screens/dummyPage/DummyPage';
import AccomodationHome from '../../screens/Accomodation/home/Home';
import Recommended from '../../screens/Accomodation/recommended/Recommended';
import MyBookings from '../../screens/Accomodation/myBookings/MyBookings';
import Wishlists from '../../screens/Accomodation/wishlists/Wishlists';
import ThankYouScreen from '../../screens/Accomodation/thankYouScreen/ThankYouScreen';
import TripDetails from '../../screens/Accomodation/tripDetails/TripDetails';
import AdvancedFilter from '../../screens/Accomodation/advancedFilter/AdvancedFilter';
import HotelDetails from '../../screens/Accomodation/hotelDetails/HotelDetails';
import RealtorProfile from '../../screens/realtorProfile/RealtorProfile';
import CalenderBooking from '../../screens/Accomodation/calenderBooking/CalenderBooking';
import Checkout from '../../screens/Accomodation/checkout/Checkout';
import OrderDetail from '../../screens/Accomodation/orderDetail/OrderDetail';
import HotelBookingDetail from '../../screens/Accomodation/hotelBookingDetail/HotelBookingDetail';
import Profile from '../../screens/profile/Profile';
import Chat from '../../screens/messages/Chat';
import Notifications from '../../screens/notifications/Notifications';

const AccomodationStackNavigator = createNativeStackNavigator();

const AccomodationStack: FC = () => {
  return (
    <AccomodationStackNavigator.Navigator
      screenOptions={{ headerShown: false }}
    >
      <AccomodationStackNavigator.Screen
        name="AccomodationHome"
        component={AccomodationHome}
      />
      <AccomodationStackNavigator.Screen
        name="CalenderBooking"
        component={CalenderBooking}
      />
      <AccomodationStackNavigator.Screen name="Checkout" component={Checkout} />
      <AccomodationStackNavigator.Screen
        name="RealtorProfile"
        component={RealtorProfile}
      />
      <AccomodationStackNavigator.Screen
        name="HotelDetails"
        component={HotelDetails}
      />
      <AccomodationStackNavigator.Screen
        name="AdvancedFilter"
        component={AdvancedFilter}
      />
      <AccomodationStackNavigator.Screen
        name="TripDetails"
        component={TripDetails}
      />
      <AccomodationStackNavigator.Screen
        name="ThankYouScreen"
        component={ThankYouScreen}
      />
      <AccomodationStackNavigator.Screen
        name="Wishlists"
        component={Wishlists}
      />
      <AccomodationStackNavigator.Screen
        name="MyBookings"
        component={MyBookings}
      />
      <AccomodationStackNavigator.Screen
        name="OrderDetail"
        component={OrderDetail}
      />
      <AccomodationStackNavigator.Screen
        name="HotelBookingDetail"
        component={HotelBookingDetail}
      />
      <AccomodationStackNavigator.Screen
        name="Recommended"
        component={Recommended}
      />
      <AccomodationStackNavigator.Screen name="Profile" component={Profile} />
      <AccomodationStackNavigator.Screen name="Chat" component={Chat} />
      <AccomodationStackNavigator.Screen
        name="Notifications"
        component={Notifications}
      />

      <AccomodationStackNavigator.Screen name="Dummy" component={DummyPage} />
    </AccomodationStackNavigator.Navigator>
  );
};

export default AccomodationStack;

const styles = StyleSheet.create({});
