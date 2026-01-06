import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { Minus, Plus, Star } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface FoodItemWithQuantityProps {
  image: ImageSourcePropType;
  title: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  onPress?: () => void;
  onQuantityChange?: (quantity: number) => void;
  initialQuantity?: number;
}

const FoodItemWithQuantity = ({
  image,
  title,
  description,
  price,
  rating,
  reviewCount,
  onPress,
  onQuantityChange,
  initialQuantity = 1,
}: FoodItemWithQuantityProps) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange?.(newQuantity);
    }
  };

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onQuantityChange?.(newQuantity);
  };

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
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={[
              styles.quantityButton,
              quantity === 1 && styles.quantityButtonDisabled,
            ]}
            onPress={handleDecrease}
            disabled={quantity === 1}
          >
            <Minus
              size={18}
              color={quantity === 1 ? colors.c_CFD1D3 : colors.black}
            />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={handleIncrease}
          >
            <Plus size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FoodItemWithQuantity;

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
    width: 120,
    height: 120,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginBottom: 8,
    lineHeight: 16,
  },
  price: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.c_F47E20,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  rating: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.black,
  },
  reviewCount: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.c_F47E20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: colors.c_F3F3F3,
  },
  quantityText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.black,
    minWidth: 20,
    textAlign: 'center',
  },
});
