import { StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBars from '../../components/tabBars/TabBars';
import AppStack from '../appStack/AppStack';
import AccomodationStack from '../accomodationStack/AccomodationStack';
import CarStack from '../carStack/CarStack';
import FoodStack from '../foodStack/FoodStack';
import ProfileStack from '../profileStack/ProfileStack';

const Tab = createBottomTabNavigator();

// const HomeScreen = () => (
//   <View>
//     <Text>Home</Text>
//   </View>
// );

// const ProfileScreen = () => (
//   <View>
//     <Text>Profile</Text>
//   </View>
// );

const BottomStack: FC = () => {
  return (
    <Tab.Navigator
      tabBar={props => <TabBars {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      backBehavior="history"
    >
      <Tab.Screen name="Accomodation" component={AccomodationStack} />
      <Tab.Screen name="Car" component={CarStack} />
      <Tab.Screen name="Food" component={FoodStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
      <Tab.Screen name="Main" component={AppStack} />
    </Tab.Navigator>
  );
};

export default BottomStack;

const styles = StyleSheet.create({});
