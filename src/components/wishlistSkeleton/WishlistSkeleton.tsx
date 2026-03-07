import { StyleSheet, View } from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import colors from '../../config/colors';

const WishlistSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Tab buttons skeleton */}
      <View style={styles.tabSection}>
        <SkeletonPlaceholder
          borderRadius={10}
          backgroundColor={colors.c_F3F3F3}
          highlightColor={colors.c_DDDDDD}
        >
          <View style={styles.tabRow}>
            <View style={styles.tabButton} />
            <View style={styles.tabButton} />
          </View>
        </SkeletonPlaceholder>
      </View>

      {/* List skeleton - FoodItemCard style cards */}
      <View style={styles.listContainer}>
        <SkeletonPlaceholder
          borderRadius={10}
          backgroundColor={colors.c_F3F3F3}
          highlightColor={colors.c_DDDDDD}
        >
          {[1, 2, 3, 4, 5].map((item) => (
            <View key={item} style={styles.cardRow}>
              <View style={styles.cardImage} />
              <View style={styles.cardContent}>
                <View style={styles.cardTitle} />
                <View style={styles.cardDescription} />
                <View style={styles.cardPrice} />
                <View style={styles.cardRating} />
              </View>
            </View>
          ))}
        </SkeletonPlaceholder>
      </View>
    </View>
  );
};

export default WishlistSkeleton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabSection: {
    paddingTop: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tabButton: {
    width: 100,
    height: 40,
    borderRadius: 100,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  cardRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
    gap: 8,
  },
  cardImage: {
    width: 114,
    height: 91,
    borderRadius: 10,
  },
  cardContent: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    width: '70%',
    height: 14,
    borderRadius: 4,
  },
  cardDescription: {
    width: '90%',
    height: 12,
    borderRadius: 4,
  },
  cardPrice: {
    width: '30%',
    height: 16,
    borderRadius: 4,
  },
  cardRating: {
    width: '50%',
    height: 12,
    borderRadius: 4,
  },
});
