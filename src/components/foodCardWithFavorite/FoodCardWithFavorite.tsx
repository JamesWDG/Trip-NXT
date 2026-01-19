import {
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { Heart, Star } from 'lucide-react-native';
import FastImage from 'react-native-fast-image';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { width } from '../../config/constants';

interface FoodCardWithFavoriteProps {
  image: ImageSourcePropType | string;
  title: string;
  rating: number;
  reviewCount: number;
  price: number;
  onPress?: () => void;
  onFavoritePress?: (isFavorite: boolean) => void;
  isFavorite?: boolean;
}

const FoodCardWithFavorite = ({
  image,
  title,
  rating,
  reviewCount,
  price,
  onPress,
  onFavoritePress,
  isFavorite: initialFavorite = false,
}: FoodCardWithFavoriteProps) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  const handleHeartPress = () => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    onFavoritePress?.(newFavoriteState);
  };

  return (
    <TouchableOpacity
      style={styles.container}
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
          <FastImage
            source={image as ImageSourcePropType}
            style={styles.image}
            resizeMode="cover"
          />
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

      <View style={styles.contentContainer}>
        <View>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color={colors.c_F47E20} fill={colors.c_F47E20} />
            <Text style={styles.rating}>{rating}</Text>
            <Text style={styles.reviewCount}>({reviewCount} reviews)</Text>
          </View>
        </View>
        <Text style={styles.price}>${price.toFixed(1)}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default FoodCardWithFavorite;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    // marginBottom: 16,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: width * 0.74,
    marginVertical: 2,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 12,
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
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  contentContainer: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.black,
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  rating: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.black,
  },
  reviewCount: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  price: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.black,
  },
});
