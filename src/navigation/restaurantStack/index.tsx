import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import DummyPage from '../../screens/dummyPage/DummyPage';
import Home from '../../screens/Restaurant/home/Home';

const ReataurantStackNavigator = createNativeStackNavigator();

const ReataurantStack: FC = () => {
  return (
    <ReataurantStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <ReataurantStackNavigator.Screen name="RestaurantHome" component={Home} />
      <ReataurantStackNavigator.Screen name="Dummy" component={DummyPage} />
    </ReataurantStackNavigator.Navigator>
  );
};

export default ReataurantStack;

const styles = StyleSheet.create({});
