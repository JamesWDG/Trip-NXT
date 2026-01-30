import { ScrollView, StyleSheet, View } from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../config/colors';
import { height, width } from '../../config/constants';

const CartSkeleton = () => {
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
          contentContainerStyle={[styles.scrollViewContent, { paddingBottom: top + 50 }]}
        >
          <SkeletonPlaceholder
            borderRadius={10}
            backgroundColor={colors.c_F3F3F3}
            highlightColor={colors.c_DDDDDD}
          >
            {/* Section Title */}
            <View style={styles.sectionTitle} />

            {/* Cart Items Skeleton */}
            {[1, 2, 3].map((item) => (
              <View key={item} style={styles.cartItemContainer}>
                <View style={styles.cartItemImage} />
                <View style={styles.cartItemContent}>
                  <View style={styles.cartItemTitle} />
                  <View style={styles.cartItemDescription} />
                  <View style={styles.cartItemPrice} />
                  <View style={styles.cartItemFooter}>
                    <View style={styles.cartItemRating} />
                    <View style={styles.cartItemQuantity} />
                  </View>
                </View>
              </View>
            ))}

            {/* Payment Summary Skeleton */}
            <View style={styles.paymentSummaryContainer}>
              <View style={styles.paymentSummaryTitle} />
              
              {/* Promo Code Input Skeleton */}
              <View style={styles.promoCodeInput} />
              
              {/* Summary Items */}
              <View style={styles.summaryCard}>
                {[1, 2, 3].map((item) => (
                  <View key={item} style={styles.summaryRow}>
                    <View style={styles.summaryLabel} />
                    <View style={styles.summaryAmount} />
                  </View>
                ))}
                <View style={styles.totalRow}>
                  <View style={styles.totalLabel} />
                  <View style={styles.totalAmount} />
                </View>
              </View>
            </View>

            {/* Action Buttons Skeleton */}
            <View style={styles.actionButtonsContainer}>
              <View style={styles.actionButton} />
              <View style={styles.actionButton} />
            </View>
          </SkeletonPlaceholder>
        </ScrollView>
      </View>
    </View>
  );
};

export default CartSkeleton;

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
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    width: 80,
    height: 24,
    borderRadius: 4,
    marginBottom: 20,
  },
  cartItemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  cartItemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  cartItemContent: {
    flex: 1,
    gap: 8,
  },
  cartItemTitle: {
    width: '70%',
    height: 16,
    borderRadius: 4,
  },
  cartItemDescription: {
    width: '90%',
    height: 12,
    borderRadius: 4,
    marginTop: 4,
  },
  cartItemPrice: {
    width: '30%',
    height: 18,
    borderRadius: 4,
    marginTop: 4,
  },
  cartItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  cartItemRating: {
    width: 100,
    height: 14,
    borderRadius: 4,
  },
  cartItemQuantity: {
    width: 80,
    height: 20,
    borderRadius: 10,
  },
  paymentSummaryContainer: {
    marginTop: 24,
    gap: 16,
  },
  paymentSummaryTitle: {
    width: 150,
    height: 20,
    borderRadius: 4,
  },
  promoCodeInput: {
    width: '100%',
    height: 48,
    borderRadius: 100,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    width: '40%',
    height: 14,
    borderRadius: 4,
  },
  summaryAmount: {
    width: '25%',
    height: 14,
    borderRadius: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: colors.lightGray,
  },
  totalLabel: {
    width: '45%',
    height: 18,
    borderRadius: 4,
  },
  totalAmount: {
    width: '30%',
    height: 18,
    borderRadius: 4,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    height: 50,
    borderRadius: 100,
  },
});
