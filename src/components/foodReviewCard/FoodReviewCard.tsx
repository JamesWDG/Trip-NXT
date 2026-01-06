import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { Star, ThumbsUp } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface DishItem {
  image: ImageSourcePropType;
  name: string;
  price: number;
}

interface FoodReviewCardProps {
  reviewerName: string;
  rating: number;
  timeAgo: string;
  reviewComment: string;
  likedDishCount: number;
  dish?: DishItem;
  helpfulCount: number;
  onHelpfulPress?: () => void;
}

const FoodReviewCard = ({
  reviewerName,
  rating,
  timeAgo,
  reviewComment,
  likedDishCount,
  dish,
  helpfulCount,
  onHelpfulPress,
}: FoodReviewCardProps) => {
  // Render stars based on rating (supporting half stars)
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        // Fully filled star
        stars.push(<Star key={i} size={16} color="#FFD700" fill="#FFD700" />);
      } else if (i === fullStars && hasHalfStar) {
        // Half-filled star - using a View with overflow to clip half
        stars.push(
          <View key={i} style={styles.halfStarContainer}>
            <Star size={16} color="#FFD700" fill="transparent" />
            <View style={styles.halfStarFilled}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
            </View>
          </View>,
        );
      } else {
        // Empty star
        stars.push(
          <Star key={i} size={16} color="#FFD700" fill="transparent" />,
        );
      }
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      {/* Reviewer Info */}
      <View style={styles.reviewerHeader}>
        <Text style={styles.reviewerName}>{reviewerName}</Text>
        <View style={styles.ratingTimeContainer}>
          <View style={styles.starsContainer}>{renderStars()}</View>
          <Text style={styles.timeAgo}>{timeAgo}</Text>
        </View>
      </View>

      {/* Review Comment */}
      <Text style={styles.reviewComment}>{reviewComment}</Text>

      {/* Liked Dish Summary */}
      <Text style={styles.likedDishText}>
        liked {likedDishCount} {likedDishCount === 1 ? 'Dish' : 'Dishes'}
      </Text>

      {/* Dish Card */}
      {dish && (
        <View style={styles.dishCard}>
          <Image
            source={dish.image}
            style={styles.dishImage}
            resizeMode="cover"
          />
          <View style={styles.dishInfo}>
            <Text style={styles.dishName}>{dish.name}</Text>
            <Text style={styles.dishPrice}>$ {dish.price.toFixed(2)}</Text>
          </View>
        </View>
      )}

      {/* Helpful Count */}
      <TouchableOpacity
        style={styles.helpfulContainer}
        onPress={onHelpfulPress}
        activeOpacity={0.7}
      >
        <ThumbsUp size={14} color={colors.black} fill={colors.black} />
        <Text style={styles.helpfulText}>Helpful {helpfulCount}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FoodReviewCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0.2,
    // borderColor: '#ADD8E6', // Light blue border
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewerHeader: {
    marginBottom: 12,
  },
  reviewerName: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.black,
    marginBottom: 8,
  },
  ratingTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  halfStarContainer: {
    position: 'relative',
    width: 16,
    height: 16,
  },
  halfStarFilled: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 8,
    height: 16,
    overflow: 'hidden',
  },
  timeAgo: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  reviewComment: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
    marginBottom: 8,
    lineHeight: 20,
  },
  likedDishText: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginBottom: 12,
  },
  dishCard: {
    flexDirection: 'row',
    backgroundColor: colors.c_F3F3F3,
    borderRadius: 8,
    // padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.lightGray,
    gap: 12,
  },
  dishImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  dishInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  dishName: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.black,
    marginBottom: 6,
  },
  dishPrice: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  helpfulContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  helpfulText: {
    fontSize: 10,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
});
