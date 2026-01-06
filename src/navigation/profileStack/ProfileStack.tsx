import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import React, { FC } from 'react';
import Profile from '../../screens/profile/Profile';
import MyBookings from '../../screens/Accomodation/myBookings/MyBookings';
import Wishlists from '../../screens/Accomodation/wishlists/Wishlists';
import Notifications from '../../screens/notifications/Notifications';
import Chat from '../../screens/messages/Chat';

const ProfileStackNavigator = createNativeStackNavigator();

const ProfileStack: FC = () => {
  return (
    <ProfileStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStackNavigator.Screen name="Profile" component={Profile} />
      <ProfileStackNavigator.Screen name="MyBookings" component={MyBookings} />
      <ProfileStackNavigator.Screen name="Wishlists" component={Wishlists} />
      <ProfileStackNavigator.Screen
        name="Notifications"
        component={Notifications}
      />
      <ProfileStackNavigator.Screen name="Chat" component={Chat} />
    </ProfileStackNavigator.Navigator>
  );
};

export default ProfileStack;
