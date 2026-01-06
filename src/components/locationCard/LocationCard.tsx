import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { Home, Bookmark } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { width } from '../../config/constants';

interface LocationCardProps {
  title: string;
  description: string;
  iconColor?: string;
  onPress?: () => void;
  onBookmarkPress?: (isBookmarked: boolean) => void;
  isBookmarked?: boolean;
}

const LocationCard = ({
  title,
  description,
  iconColor = colors.c_F47E20,
  onPress,
  onBookmarkPress,
  isBookmarked: initialBookmarked = false,
}: LocationCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

  const handleBookmarkPress = () => {
    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);
    onBookmarkPress?.(newBookmarkState);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.contentContainer}>
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <Home size={24} color={iconColor} strokeWidth={2} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.description} numberOfLines={1}>
              {description}
            </Text>
          </View>
        </View>
        {onBookmarkPress && (
          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={handleBookmarkPress}
            activeOpacity={0.7}
          >
            <Bookmark
              size={22}
              color={colors.lightGray}
              //   fill={isBookmarked ? colors.c_666666 : 'transparent'}
              fill={colors.lightGray}
              strokeWidth={1.5}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default LocationCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 3,
    // padding: 16,
    marginBottom: 12,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: width * 0.46,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    // gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.c_2B2B2B,
  },
  description: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  bookmarkButton: {
    // padding: 4,
    position: 'absolute',
    right: 0,
    top: -13,
  },
});
