import { View, StyleSheet } from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import colors from '../../config/colors';

const CARD_COUNT = 6;

const RestaurantListSkeleton = () => {
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder
        borderRadius={10}
        backgroundColor={colors.c_F3F3F3}
        highlightColor={colors.c_DDDDDD}
      >
        {Array.from({ length: CARD_COUNT }).map((_, i) => (
          <View key={i} style={styles.cardRow}>
            <View style={styles.imageWrap} />
            <View style={styles.cardTextWrap}>
              <View style={styles.cardTitle} />
              <View style={styles.cardDesc} />
            </View>
          </View>
        ))}
      </SkeletonPlaceholder>
    </View>
  );
};

export default RestaurantListSkeleton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  imageWrap: {
    width: 72,
    height: 72,
    borderRadius: 10,
  },
  cardTextWrap: {
    flex: 1,
    marginLeft: 14,
  },
  cardTitle: {
    width: '70%',
    height: 16,
    borderRadius: 4,
    marginBottom: 8,
  },
  cardDesc: {
    width: '90%',
    height: 12,
    borderRadius: 4,
  },
});
