import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { Heart, MapPin, Star } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import FastImage from 'react-native-fast-image';

interface RestaurantCardProps {
  image: ImageSourcePropType | string;
  restaurantName: string;
  rating: number;
  reviewCount: number;
  location: string;
  onPress?: () => void;
  onHeartPress?: (isFavorite: boolean) => void;
  isFavorite?: boolean;
  otherStyles?: any;
}

const RestaurantCard = ({
  image,
  restaurantName,
  rating,
  reviewCount,
  location,
  onPress,
  onHeartPress,
  isFavorite: initialFavorite = false,
  otherStyles,
}: RestaurantCardProps) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  const handleHeartPress = () => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    onHeartPress?.(newFavoriteState);
  };

  return (
    <TouchableOpacity
      style={[styles.container, otherStyles]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        {typeof image === 'string' ? (
          <FastImage
            source={{ uri: image } as any}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Image source={image} style={styles.image} resizeMode="cover" />
        )}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={handleHeartPress}
          activeOpacity={0.7}
        >
          <Heart
            size={20}
            color={isFavorite ? colors.c_EE4026 : colors.c_EE4026}
            fill={isFavorite ? colors.c_EE4026 : 'transparent'}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.nameRatingContainer}>
          <Text style={styles.restaurantName} numberOfLines={1}>
            {restaurantName}
          </Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#FFD700" fill="#FFD700" />
            <Text style={styles.rating}>{rating}</Text>
            <Text style={styles.reviewCount}>({reviewCount} reviews)</Text>
          </View>
        </View>

        <View style={styles.locationContainer}>
          <MapPin size={14} color={colors.c_F47E20} />
          <Text style={styles.location} numberOfLines={1}>
            {location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RestaurantCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    // borderWidth: 1,
    // borderColor: colors.primary,
    marginBottom: 16,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow for heart button
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  infoContainer: {
    padding: 16,
  },
  nameRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  restaurantName: {
    flex: 1,
    fontSize: 18,
    fontFamily: fonts.semibold,
    color: colors.black,
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.black,
  },
  reviewCount: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  location: {
    fontSize: 13,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    flex: 1,
  },
});
