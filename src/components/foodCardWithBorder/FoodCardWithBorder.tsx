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

interface FoodCardWithBorderProps {
  image: ImageSourcePropType | string;
  title: string;
  category: string;
  rating: number;
  price: number;
  hasFreeship?: boolean;
  onPress?: () => void;
  onFavoritePress?: (isFavorite: boolean) => void;
  isFavorite?: boolean;
}

const FoodCardWithBorder = ({
  image,
  title,
  category,
  rating,
  price,
  hasFreeship = false,
  onPress,
  onFavoritePress,
  isFavorite: initialFavorite = false,
}: FoodCardWithBorderProps) => {
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
      <View style={styles.imageWrapper}>
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
              size={18}
              color={isFavorite ? colors.c_EE4026 : colors.c_EE4026}
              fill={isFavorite ? colors.c_EE4026 : 'transparent'}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.categoryRatingContainer}>
          <Text style={styles.category}>{category}</Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color={colors.c_F47E20} fill={colors.c_F47E20} />
            <Text style={styles.rating}>{rating}</Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${price}</Text>
          {hasFreeship && (
            <View style={styles.freeshipTag}>
              <Text style={styles.freeshipText}>Freeship</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FoodCardWithBorder;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.c_F3F3F3,
    borderRadius: 12,
    overflow: 'hidden',
    // marginBottom: 16,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 3
  },
  imageWrapper: {
    // padding: 8,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.c_EE4026,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  contentContainer: {
    padding: 12,
    paddingTop: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.c_2B2B2B,
    marginBottom: 6,
    lineHeight: 20,
  },
  categoryRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_2B2B2B,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  price: {
    fontSize: 18,
    fontFamily: fonts.semibold,
    color: colors.c_F47E20,
  },
  freeshipTag: {
    backgroundColor: colors.c_EE4026,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  freeshipText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.white,
  },
});
