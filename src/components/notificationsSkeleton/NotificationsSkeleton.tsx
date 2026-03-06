import { StyleSheet, View } from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import colors from '../../config/colors';

const NotificationsSkeleton = () => {
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder
        borderRadius={10}
        backgroundColor={colors.c_F3F3F3}
        highlightColor={colors.c_DDDDDD}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <View key={i} style={styles.item}>
            <View style={styles.iconPlaceholder} />
            <View style={styles.textBlock}>
              <View style={styles.titleLine} />
              <View style={styles.bodyLine} />
              <View style={styles.bodyLineShort} />
              <View style={styles.timeLine} />
            </View>
          </View>
        ))}
      </SkeletonPlaceholder>
    </View>
  );
};

export default NotificationsSkeleton;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 20,
  },
  iconPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  textBlock: {
    flex: 1,
    gap: 8,
  },
  titleLine: {
    width: '60%',
    height: 16,
    borderRadius: 6,
  },
  bodyLine: {
    width: '100%',
    height: 12,
    borderRadius: 4,
  },
  bodyLineShort: {
    width: '75%',
    height: 12,
    borderRadius: 4,
  },
  timeLine: {
    width: '30%',
    height: 10,
    borderRadius: 4,
    marginTop: 4,
  },
});
