import { ScrollView, StyleSheet, View } from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../config/colors';
import { height, width } from '../../config/constants';

const RestaurantInformationSkeleton = () => {
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          <SkeletonPlaceholder
            borderRadius={10}
            backgroundColor={colors.c_F3F3F3}
            highlightColor={colors.c_DDDDDD}
          >
            {/* Restaurant Info Section */}
            <View style={styles.restaurantInfoContainer}>
              <View style={styles.restaurantLogo} />
              <View style={styles.restaurantTextContainer}>
                <View style={styles.restaurantName} />
                <View style={styles.restaurantLocation} />
              </View>
            </View>

            {/* Info Cards Section */}
            <View style={styles.infoCardsContainer}>
              {[1, 2, 3].map((item) => (
                <View key={item} style={styles.infoCard}>
                  <View style={styles.infoIconCircle} />
                  <View style={styles.infoTextContainer}>
                    <View style={styles.infoValue} />
                    <View style={styles.infoLabel} />
                  </View>
                </View>
              ))}
            </View>

            {/* Featured Foods Section */}
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitle} />
            </View>
            <View style={styles.featuredContainer}>
              {[1, 2, 3, 4].map((item) => (
                <View key={item} style={styles.featuredCard}>
                  <View style={styles.featuredImage} />
                  <View style={styles.featuredContent}>
                    <View style={styles.featuredTitle} />
                    <View style={styles.featuredRating} />
                    <View style={styles.featuredPrice} />
                  </View>
                </View>
              ))}
            </View>

            {/* Menu Section */}
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitle} />
            </View>
            <View style={styles.menuGridContainer}>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <View key={item} style={styles.menuCard}>
                  <View style={styles.menuImage} />
                  <View style={styles.menuContent}>
                    <View style={styles.menuTitle} />
                    <View style={styles.menuCategory} />
                    <View style={styles.menuRating} />
                    <View style={styles.menuPrice} />
                  </View>
                </View>
              ))}
            </View>
          </SkeletonPlaceholder>
        </ScrollView>
      </View>
    </View>
  );
};

export default RestaurantInformationSkeleton;

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
  },
  restaurantInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  restaurantLogo: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
  },
  restaurantTextContainer: {
    flex: 1,
    gap: 8,
  },
  restaurantName: {
    width: '70%',
    height: 20,
    borderRadius: 4,
  },
  restaurantLocation: {
    width: '50%',
    height: 16,
    borderRadius: 4,
  },
  infoCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 10,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  infoIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  infoTextContainer: {
    flex: 1,
    gap: 6,
  },
  infoValue: {
    width: '60%',
    height: 16,
    borderRadius: 4,
  },
  infoLabel: {
    width: '80%',
    height: 12,
    borderRadius: 4,
  },
  sectionHeader: {
    marginBottom: 16,
    marginTop: 10,
  },
  sectionTitle: {
    width: 150,
    height: 20,
    borderRadius: 4,
  },
  featuredContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
    paddingRight: 20,
  },
  featuredCard: {
    width: 280,
    borderRadius: 12,
    gap: 10,
  },
  featuredImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  featuredContent: {
    gap: 8,
    paddingHorizontal: 4,
  },
  featuredTitle: {
    width: '80%',
    height: 16,
    borderRadius: 4,
  },
  featuredRating: {
    width: '40%',
    height: 14,
    borderRadius: 4,
  },
  featuredPrice: {
    width: '30%',
    height: 16,
    borderRadius: 4,
  },
  menuGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    paddingBottom: 60,
  },
  menuCard: {
    width: (width - 52) / 2,
    borderRadius: 12,
    gap: 10,
    marginBottom: 12,
  },
  menuImage: {
    width: '100%',
    height: 140,
    borderRadius: 12,
  },
  menuContent: {
    gap: 6,
    paddingHorizontal: 4,
  },
  menuTitle: {
    width: '90%',
    height: 14,
    borderRadius: 4,
  },
  menuCategory: {
    width: '50%',
    height: 12,
    borderRadius: 4,
  },
  menuRating: {
    width: '40%',
    height: 12,
    borderRadius: 4,
  },
  menuPrice: {
    width: '35%',
    height: 16,
    borderRadius: 4,
  },
  scrollViewContent: {
    paddingBottom: 60,
  },
});
