import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useMemo, useState } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Eye,
  Edit2,
  CreditCard,
  DollarSign,
  Crosshair,
  LocateFixed,
} from 'lucide-react-native';
import GeneralStyles from '../../../utils/GeneralStyles';
import FoodHeader from '../../../components/foodHeader/FoodHeader';
import MainCarousel from '../../../components/mainCarousel/MainCarousel';
import PaymentOption from '../../../components/paymentOption/PaymentOption';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import { CarouselData } from '../../../constants/Accomodation';
import PrimaryHeader from '../../../components/primaryHeader/PrimaryHeader';
import images from '../../../config/images';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';

const Checkout = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const { top } = useSafeAreaInsets();
  const [isFavorite, setIsFavorite] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [landmark, setLandmark] = useState('');

  const contentStyles = useMemo(() => makeContentStyles(top), [top]);
  const wishlistButtonStyles = useMemo(() => wishlistButton(top), [top]);

  const orderItems = [{ label: '1x Chicken Cheese Burger', amount: 75.58 }];

  const paymentSummaryItems = [
    { label: 'Subtotal', amount: 75.58 },
    { label: 'Coupon discount', amount: 5.5, isDiscount: true },
    { label: 'Delivery Fee', amount: 5.0 },
  ];

  const total = 75.58 - 5.5 + 5.0;

  const handleOrderPlace = () => {
    navigation.navigate('FoodOrderTracking');
    console.log('Order placed:', {
      paymentMethod,
      landmark,
      total,
    });
    // Handle order placement
  };

  return (
    <View style={[GeneralStyles.flex, styles.container]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <PrimaryHeader
          title={'Checkout'}
          onBackPress={() => navigation.goBack()}
        />
      </View>

      {/* Map Carousel */}
      <View style={wishlistButtonStyles.carouselContainer}>
        <MainCarousel data={CarouselData} />
      </View>

      {/* White Content Card */}
      <View style={contentStyles.contentCard}>
        <ScrollView
          style={GeneralStyles.flex}
          contentContainerStyle={contentStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Delivery Address Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <View style={styles.addressInputRow}>
              <View style={[styles.addressInputContainer, styles.shadowBox]}>
                <TextInput
                  style={styles.addressInput}
                  placeholder="e.g. landmark"
                  placeholderTextColor={colors.c_666666}
                  value={landmark}
                  onChangeText={setLandmark}
                />
              </View>
              <TouchableOpacity
                style={[styles.targetButton, styles.shadowBox]}
                activeOpacity={0.7}
                onPress={() => {
                  // Handle target/location button press
                }}
              >
                <LocateFixed size={20} color={colors.black} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Delivery Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Delivery Information</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Edit2 size={18} color={colors.c_666666} />
              </TouchableOpacity>
            </View>
            <View style={styles.deliveryInfo}>
              <Text style={styles.infoText}>
                Name: <Text style={styles.infoTextValue}>Marian Livera</Text>
              </Text>
              <Text style={styles.infoText}>
                Phone number:{' '}
                <Text style={styles.infoTextValue}>+837 736363</Text>
              </Text>
              <Text style={styles.infoText}>
                Address: <Text style={styles.infoTextValue}>New York, USA</Text>
              </Text>
            </View>
          </View>

          {/* Pay With Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pay With</Text>
            <View style={styles.paymentOptionWrapper}>
              <PaymentOption
                label="Credit Card"
                selected={paymentMethod === 'card'}
                onSelect={() => setPaymentMethod('card')}
              />
              <View style={styles.paymentOptionRight}>
                <View style={styles.visaBadge}>
                  <Text style={styles.visaText}>VISA</Text>
                </View>
              </View>
            </View>

            <View style={styles.paymentOptionWrapper}>
              <PaymentOption
                label="Cash"
                selected={paymentMethod === 'cash'}
                onSelect={() => setPaymentMethod('cash')}
              />
              <View style={styles.paymentOptionRight}>
                <Image source={images.money} />
              </View>
            </View>
          </View>

          {/* Order Summary Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>

            {/* Order Items */}
            <View style={styles.orderItemsContainer}>
              {orderItems.map((item, index) => (
                <View key={index}>
                  <View style={styles.orderItemRow}>
                    <Text style={styles.orderItemLabel}>{item.label}</Text>
                    <Text style={styles.orderItemAmount}>
                      ${item.amount.toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.separatorLine} />

            {/* Summary Details */}
            <View style={styles.summaryDetailsContainer}>
              {/* Subtotal */}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryAmount}>
                  ${paymentSummaryItems[0].amount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.separatorLine} />

              {/* Coupon Discount */}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Coupon discount</Text>
                <Text style={styles.discountAmount}>
                  -${paymentSummaryItems[1].amount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.separatorLine} />

              {/* Delivery Fee */}
              <View style={styles.summaryRow}>
                <Text style={styles.deliveryFeeLabel}>Delivery Fee</Text>
                <Text style={styles.summaryAmount}>
                  ${paymentSummaryItems[2].amount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.dashedSeparatorLine} />

              {/* Total Amount */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
              </View>
            </View>
          </View>
          <GradientButtonForAccomodation
            title="Order Place"
            onPress={handleOrderPlace}
            color={colors.white}
            fontSize={16}
            fontFamily={fonts.semibold}
            otherStyles={styles.orderButton}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default Checkout;

const makeContentStyles = (top: number) =>
  StyleSheet.create({
    contentCard: {
      flex: 1,
      backgroundColor: colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginTop: -90,
      zIndex: 999,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: top + 50,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
  });

const wishlistButton = (top: number) =>
  StyleSheet.create({
    carouselContainer: {
      zIndex: 10,
      marginTop: -top + 20,
    },
  });

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.c_2B2B2B,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  titleContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 50,
  },
  title: {
    fontSize: 32,
    fontFamily: fonts.semibold,
    color: colors.c_CFD1D3,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.semibold,
    color: colors.black,
    marginBottom: 12,
  },
  addressInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addressInputContainer: {
    flex: 1,
    // backgroundColor: colors.c_F3F3F3,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.c_DDDDDD,
  },
  addressInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
  },
  targetButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.white,

    justifyContent: 'center',
    alignItems: 'center',
  },
  deliveryInfo: {
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
  },
  paymentOptionWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  paymentOptionRight: {
    position: 'absolute',
    right: 16,
    top: '35%',
    transform: [{ translateY: -10 }],
    zIndex: 10,
  },
  visaBadge: {
    backgroundColor: colors.c_0162C0,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  visaText: {
    fontSize: 12,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  orderItemsContainer: {
    marginBottom: 8,
  },
  orderItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  orderItemLabel: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
  },
  orderItemAmount: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  separatorLine: {
    height: 1,
    backgroundColor: colors.c_DDDDDD,
    marginVertical: 0,
  },
  summaryDetailsContainer: {
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
  },
  summaryAmount: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  discountAmount: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  deliveryFeeLabel: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.c_0162C0,
  },
  dashedSeparatorLine: {
    borderTopWidth: 1,
    borderColor: colors.c_DDDDDD,
    borderStyle: 'dashed',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: fonts.semibold,
    color: colors.c_2B2B2B,
  },
  totalAmount: {
    fontSize: 18,
    fontFamily: fonts.semibold,
    color: colors.c_2B2B2B,
  },
  orderButton: {
    // backgroundColor: colors.primary,
    borderRadius: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  orderButtonText: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  shadowBox: {
    // iOS
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, // 26 hex ≈ 15% opacity
    shadowRadius: 8,

    // Android
    elevation: 5, // approximate equivalent
    backgroundColor: '#fff', // zaroori hota hai shadow dikhne ke liye
  },
  infoTextValue: {
    fontFamily: fonts.semibold,
  },
});
