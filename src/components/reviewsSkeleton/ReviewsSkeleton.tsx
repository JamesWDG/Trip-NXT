import { StyleSheet, View } from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../config/colors';
import { height, width } from '../../config/constants';

const ReviewsSkeleton = () => {
  const { top } = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Banner Skeleton */}
      <SkeletonPlaceholder
        borderRadius={10}
        backgroundColor={colors.c_F3F3F3}
        highlightColor={colors.c_DDDDDD}
      >
        <View style={styles.bannerContainer}>
          <View style={styles.banner} />
        </View>
      </SkeletonPlaceholder>

      {/* Content Card Skeleton */}
      <View style={[styles.contentCard, { marginTop: -90 }]}>
        <SkeletonPlaceholder
          borderRadius={10}
          backgroundColor={colors.c_F3F3F3}
          highlightColor={colors.c_DDDDDD}
        >
          {[1, 2, 3, 4].map((item) => (
            <View key={item} style={styles.reviewCard}>
              {/* Reviewer header */}
              <View style={styles.reviewerName} />
              <View style={styles.ratingTimeRow}>
                <View style={styles.starsLine} />
                <View style={styles.timeAgo} />
              </View>
              {/* Comment lines */}
              <View style={styles.commentLine1} />
              <View style={styles.commentLine2} />
              <View style={styles.commentLine3} />
              {/* Dish card */}
              <View style={styles.dishCard}>
                <View style={styles.dishImage} />
                <View style={styles.dishInfo}>
                  <View style={styles.dishName} />
                  <View style={styles.dishPrice} />
                </View>
              </View>
            </View>
          ))}
        </SkeletonPlaceholder>
      </View>
    </View>
  );
};

export default ReviewsSkeleton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  bannerContainer: {
    marginTop: -20,
  },
  banner: {
    width: width,
    height: height * 0.4,
    borderRadius: 10,
  },
  contentCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 999,
    paddingTop: 35,
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  reviewCard: {
    marginBottom: 16,
    paddingVertical: 4,
  },
  reviewerName: {
    width: '45%',
    height: 14,
    borderRadius: 4,
    marginBottom: 10,
  },
  ratingTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  starsLine: {
    width: 100,
    height: 14,
    borderRadius: 4,
  },
  timeAgo: {
    width: 80,
    height: 12,
    borderRadius: 4,
  },
  commentLine1: {
    width: '100%',
    height: 12,
    borderRadius: 4,
    marginBottom: 6,
  },
  commentLine2: {
    width: '90%',
    height: 12,
    borderRadius: 4,
    marginBottom: 6,
  },
  commentLine3: {
    width: '60%',
    height: 12,
    borderRadius: 4,
    marginBottom: 12,
  },
  dishCard: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  dishImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  dishInfo: {
    flex: 1,
    gap: 8,
  },
  dishName: {
    width: '50%',
    height: 14,
    borderRadius: 4,
  },
  dishPrice: {
    width: '30%',
    height: 12,
    borderRadius: 4,
  },
});
