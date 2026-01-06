import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useMemo } from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { TabStackArray } from '../../constants/tabsStack';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

// List of screens where tab bar should be shown
const SHOW_TAB_BAR_ROUTES = [
  'AccomodationHome',
  'RideHome',
  'FoodHome',
  'Profile',
];

// Map of tab names to their default home screens
const TAB_TO_HOME_MAP: { [key: string]: string } = {
  Accomodation: 'AccomodationHome',
  Car: 'RideHome',
  Food: 'FoodHome',
  Profile: 'Profile',
};

const TabBars = (props: BottomTabBarProps) => {
  const { bottom } = useSafeAreaInsets();
  const mainContainer = useMemo(() => mainContainerStyle(bottom), [bottom]);

  // Get current route and nested route name
  const currentRoute = props.state.routes[props.state.index];
  const tabName = currentRoute?.name;
  const nestedRouteName = getFocusedRouteNameFromRoute(currentRoute);

  // Check if nested route is a home screen
  const isHomeScreen =
    nestedRouteName && SHOW_TAB_BAR_ROUTES.includes(nestedRouteName);

  // Check if current tab is one of the main tabs (Accomodation, Car, Food, Profile)
  const isMainTab =
    tabName && ['Accomodation', 'Car', 'Food', 'Profile'].includes(tabName);

  // Show tab bar if:
  // 1. It's a home screen (AccomodationHome, RideHome, FoodHome, Profile)
  // 2. OR it's a main tab (Accomodation, Car, Food, Profile) and nested route is not set (initial screen = home)
  const shouldShow = isHomeScreen || (isMainTab && !nestedRouteName);

  // Hide tab bar if not in allowed routes
  if (!shouldShow) {
    return null;
  }

  return (
    <View style={[mainContainer.container, styles.box]}>
      <LinearGradient
        colors={['#F47E20', '#EE4026']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.tabContainer}>
          {TabStackArray.map(tab => (
            <TouchableOpacity
              key={tab.name}
              style={styles.tab}
              onPress={() => props.navigation.navigate(tab.navigation)}
            >
              <Image source={tab.image} style={styles.image} />
              <Text style={styles.tabText}>{tab.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
};

export default TabBars;

const mainContainerStyle = (bottom: number) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: bottom + 5,
      // width: '100%',
      left: 0,
      right: 0,
      height: 64,
    },
  });
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    borderRadius: 100,
  },
  image: {
    height: 17,
    width: 17,
  },
  box: {
    marginHorizontal: 20,
    borderRadius: 100,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35, // 0.35 ≈ 0x59 opacity
    shadowRadius: 12,

    // Shadow for Android
    elevation: 8, // tweak this for matching intensity
  },
  tabContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    flex: 1,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flex: 1,
  },
  tabText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: fonts.medium,
  },
});
