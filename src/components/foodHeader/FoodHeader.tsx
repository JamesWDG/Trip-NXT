import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Bell, ShoppingBag, Heart } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../config/colors';

interface FoodHeaderProps {
  onBackPress?: () => void;
  onNotificationPress?: () => void;
  onCartPress?: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
  notificationCount?: number;
}

const FoodHeader = ({
  onBackPress,
  onNotificationPress,
  onCartPress,
  onFavoritePress,
  isFavorite = false,
  notificationCount = 0,
}: FoodHeaderProps) => {
  const { top } = useSafeAreaInsets();
  const headerStyles = useMemo(() => makeHeaderStyles(top), [top]);

  return (
    <View style={[headerStyles.container, styles.header]}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBackPress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#F47E20', '#EE4026']}
          style={styles.gradientButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <ChevronLeft size={24} color={colors.white} />
        </LinearGradient>
      </TouchableOpacity>

      {/* Right Icons */}
      <View style={styles.rightIcons}>
        {/* Notification Bell */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onNotificationPress}
          activeOpacity={0.7}
        >
          <View style={styles.bellContainer}>
            <Bell size={24} color={colors.white} />
            {notificationCount > 0 && <View style={styles.notificationDot} />}
          </View>
        </TouchableOpacity>

        {/* Shopping Bag */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onCartPress}
          activeOpacity={0.7}
        >
          <ShoppingBag size={24} color={colors.white} />
        </TouchableOpacity>

        {/* Heart/Favorite */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onFavoritePress}
          activeOpacity={0.7}
        >
          <View style={styles.heartContainer}>
            <Heart
              size={24}
              color={isFavorite ? colors.c_F47E20 : colors.white}
              fill={isFavorite ? colors.c_F47E20 : 'none'}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FoodHeader;

const makeHeaderStyles = (top: number) =>
  StyleSheet.create({
    container: {
      paddingTop: top + 10,
      paddingBottom: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
    },
  });

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradientButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellContainer: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.c_F47E20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  heartContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
