import { StyleSheet, View } from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import colors from '../../config/colors';

const CategorySkeleton = () => {
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder
        borderRadius={10}
        backgroundColor={colors.c_F3F3F3}
        highlightColor={colors.c_DDDDDD}
      >
        <View style={styles.listContent}>
          {/* 2-column grid of cards - 6 items = 3 rows */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <View key={item} style={styles.cardRow}>
              <View style={styles.cardImage} />
              <View style={styles.cardContent}>
                <View style={styles.cardTitle} />
                <View style={styles.cardCategory} />
                <View style={styles.cardRating} />
                <View style={styles.cardPrice} />
              </View>
            </View>
          ))}
        </View>
      </SkeletonPlaceholder>
    </View>
  );
};

export default CategorySkeleton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardRow: {
    width: '48%',
    marginBottom: 12,
    flexDirection: 'column',
  },
  cardImage: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    marginBottom: 10,
  },
  cardContent: {
    gap: 8,
  },
  cardTitle: {
    width: '85%',
    height: 14,
    borderRadius: 4,
  },
  cardCategory: {
    width: '50%',
    height: 12,
    borderRadius: 4,
  },
  cardRating: {
    width: '40%',
    height: 12,
    borderRadius: 4,
  },
  cardPrice: {
    width: '35%',
    height: 16,
    borderRadius: 4,
  },
});
