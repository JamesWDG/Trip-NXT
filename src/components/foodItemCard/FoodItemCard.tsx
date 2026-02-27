import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { Heart, Star } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface FoodItemCardProps {
  image: ImageSourcePropType;
  title: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  onPress?: () => void;
  onRemove?: () => void;
  isFavorite?: boolean;
}

const FoodItemCard = ({
  image,
  title,
  description,
  price,
  rating,
  reviewCount,
  onPress,
  onRemove,
  isFavorite = false,
}: FoodItemCardProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.cardTouchable}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Image source={image} style={styles.image} resizeMode="cover" />
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
          <Text style={styles.price}>${price.toFixed(1)}</Text>
          <View style={styles.ratingContainer}>
            <Star size={16} color={colors.c_F47E20} fill={colors.c_F47E20} />
            <Text style={styles.rating}>{rating}</Text>
            <Text style={styles.reviewCount}>({reviewCount} reviews)</Text>
          </View>
        </View>
      </TouchableOpacity>
      {onRemove && (
        <TouchableOpacity
          style={styles.heartButton}
          onPress={onRemove}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Heart
            size={18}
            color={colors.c_EE4026}
            fill={isFavorite ? colors.c_EE4026 : 'transparent'}
            strokeWidth={2}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FoodItemCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTouchable: {
    flexDirection: 'row',
    flex: 1,
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.c_EE4026,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 114,
    height: 91,
    borderRadius: 10,
  },
  content: {
    flex: 1,
    // padding: 6,
    paddingHorizontal: 6,
    justifyContent: 'space-between',
    // backgroundColor: 'red',
  },
  title: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.black,
    width: '80%',
  },
  description: {
    fontSize: 13,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginBottom: 3,
    lineHeight: 16,
    width: '89%',
  },
  price: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 3,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.black,
  },
  reviewCount: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
});
