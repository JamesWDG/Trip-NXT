import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { Minus, Plus, PlusIcon, Star } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import FastImage from 'react-native-fast-image';

interface CartItemCardProps {
  image: ImageSourcePropType | string;
  title: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onPress?: () => void;
}

const CartItemCard = ({
  image,
  title,
  description,
  price,
  rating,
  reviewCount,
  quantity,
  onQuantityChange,
  onPress,
}: CartItemCardProps) => {
  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    onQuantityChange(quantity + 1);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {typeof image === 'string' ? (
        <FastImage
          source={{ uri: image } as any}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <Image source={image} style={styles.image} resizeMode="cover" />
      )}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
        <Text style={styles.price}>${price.toFixed(1)}</Text>
        <View style={styles.ratingAndQuantityContainer}>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#FFD700" fill="#FFD700" />
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
                size={12}
                color={quantity === 1 ? colors.c_CFD1D3 : colors.white}
              />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleIncrease}
            >
              <PlusIcon size={12} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CartItemCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    gap: 8,
    // Shadow
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
    // elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.black,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginBottom: 4,
    lineHeight: 16,
  },
  price: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.c_F47E20,
    marginBottom: 4,
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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap: 12,
  },
  quantityButton: {
    width: 20,
    height: 20,
    borderRadius: 16,
    backgroundColor: colors.c_F47E20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  quantityButtonDisabled: {
    backgroundColor: colors.c_F3F3F3,
  },
  quantityText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.black,
    minWidth: 24,
    textAlign: 'center',
  },
  ratingAndQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
});
