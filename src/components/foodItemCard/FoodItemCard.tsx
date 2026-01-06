import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { Star } from 'lucide-react-native';
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
}

const FoodItemCard = ({
  image,
  title,
  description,
  price,
  rating,
  reviewCount,
  onPress,
}: FoodItemCardProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
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
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  },
  description: {
    fontSize: 13,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginBottom: 3,
    lineHeight: 16,
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
