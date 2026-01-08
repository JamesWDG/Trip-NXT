import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { StyleSheet, Text, View } from 'react-native';
import  { FC } from 'react';
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
import Notifications from '../../screens/notifications/Notifications';
import Checkout from '../../screens/Accomodation/checkout/Checkout';
import Profile from '../../screens/profile/Profile';
import Chat from '../../screens/messages/Chat';

const AppStackNavigator = createNativeStackNavigator();

const AppStack: FC = () => {
  return (
    <AppStackNavigator.Navigator
      id="AppStackNavigator"
      screenOptions={{ headerShown: false }}
    >
      <AppStackNavigator.Screen
        name="RealtorProfile"
        component={RealtorProfile}
      />
      <AppStackNavigator.Screen name="HotelDetails" component={HotelDetails} />
      <AppStackNavigator.Screen
        name="AdvancedFilter"
        component={AdvancedFilter}
      />
    
      <AppStackNavigator.Screen name="TripDetails" component={TripDetails} />
      <AppStackNavigator.Screen
        name="ThankYouScreen"
        component={ThankYouScreen}
      />
      <AppStackNavigator.Screen name="Wishlists" component={Wishlists} />
      <AppStackNavigator.Screen name="MyBookings" component={MyBookings} />
      <AppStackNavigator.Screen name="Recommended" component={Recommended} />
      <AppStackNavigator.Screen
        name="AccomodationHome"
        component={AccomodationHome}
      />
      <AppStackNavigator.Screen
        name="Notifications"
        component={Notifications}
      />
      <AppStackNavigator.Screen name="Checkout" component={Checkout} />
      <AppStackNavigator.Screen name="Profile" component={Profile} />
      <AppStackNavigator.Screen name="Chat" component={Chat} />
      <AppStackNavigator.Screen name="Dummy" component={DummyPage} />
    </AppStackNavigator.Navigator>
  );
};

export default AppStack;

const styles = StyleSheet.create({});
