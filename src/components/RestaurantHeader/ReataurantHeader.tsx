import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import images from '../../config/images';
import {
  BellIcon,
  ChevronLeftIcon,
  Heart,
  ShoppingBag,
  User2Icon,
} from 'lucide-react-native';
import colors from '../../config/colors';

interface RestaurantHeaderProps {
  navigation?: any;
  onPress: () => void;
  onBackPress: () => void;
}

const RestaurantHeader = ({
  navigation,
  onPress,
  onBackPress,
}: RestaurantHeaderProps) => {
  const { top } = useSafeAreaInsets();
  const HomeHeaderStyle = useMemo(() => HomeHeaderStyles(top), [top]);

  const handleNotificationPress = () => {
    navigation?.navigate('Notifications');
  };

  const handleProfilePress = () => {
    navigation?.navigate('Profile');
  };

  return (
    <View style={HomeHeaderStyle.container}>
      <TouchableOpacity style={styles.backButtonStyles} onPress={onBackPress}>
        <ChevronLeftIcon color={colors.white} />
      </TouchableOpacity>

      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={handleNotificationPress}>
          <BellIcon fill={colors.white} color={colors.white} size={25} />
        </TouchableOpacity>
        <TouchableOpacity>
          <ShoppingBag color={colors.white} size={25} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.userIconStyles}
          onPress={handleProfilePress}
        >
          <Heart color={colors.c_F47E20} size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RestaurantHeader;

const HomeHeaderStyles = (top: number) =>
  StyleSheet.create({
    container: {
      paddingTop: top,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
  });

const styles = StyleSheet.create({
  hamburgerImage: {
    width: 30,
    height: 25,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  userIconStyles: {
    borderColor: colors.white,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 100,
    padding: 5,
  },
  backButtonStyles: {
    backgroundColor: colors.c_EE4026,
    padding: 5,
    borderRadius: 100,
  },
});
