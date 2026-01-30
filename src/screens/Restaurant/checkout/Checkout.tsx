import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Edit2,
  LocateFixed,
} from 'lucide-react-native';
import GeneralStyles from '../../../utils/GeneralStyles';
import MainCarousel from '../../../components/mainCarousel/MainCarousel';
import PaymentOption from '../../../components/paymentOption/PaymentOption';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import PrimaryHeader from '../../../components/primaryHeader/PrimaryHeader';
import images from '../../../config/images';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { AuthState } from '../../../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from '../../../constants/Food';
import { useCreateOrderMutation } from '../../../redux/services/restaurant.service';
import { height, ShowToast } from '../../../config/constants';
import DestinationSearch from '../../../components/destinationSearch/DestinationSearch';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';

const Checkout = ({ navigation, route }: { navigation: NavigationProp<any>, route: RouteProp<{ params: { total: number, subTotal: number, deliveryFee: number, couponDiscount: number } }> }) => {
  const { top } = useSafeAreaInsets();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [landmark, setLandmark] = useState<{
    address: string;
    city: string;
    destination: string;
    lat?: number;
    lng?: number;
    place_id?: string;
  }>({
    address: '',
    city: '',
    destination: '',
    lat: 0,
    lng: 0,
    place_id: '',
  });
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const contentStyles = useMemo(() => makeContentStyles(top), [top]);
  const wishlistButtonStyles = useMemo(() => wishlistButton(top), [top]);
  const { user } = useSelector<RootState, AuthState>((state) => state.auth);
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const handleOrderPlace = async () => {
    try {
      if (paymentMethod === 'card') {
        console.log('initPaymentSheet ===>');
        const { error, } = await initPaymentSheet({
          merchantDisplayName: 'TripNxt LLC',
          paymentIntentClientSecret: 'pi_3StzzFRT7PBrdzjo1Y555wiZ_secret_he8laSFEMv1ZbtBukbCDiSwE4', // retrieve this from your server
        });
        if (error) {
          // handle error
          console.log('error ===>', error);
        } else {
          const { error: presentError } = await presentPaymentSheet();

          if (presentError) {
            console.log('Payment error:', presentError);
          } else {
            console.log('Payment completed');
          }
        }
      }
      const payload = {
        totalAmount: route.params?.total,
        subTotal: route.params?.subTotal,
        discountId: 1,
        tax: 0,
        deliveryFee: route.params?.deliveryFee,
        orderItems: orderItems.map(item => ({
          itemId: typeof item.id === 'string' ? parseInt(item.id) : item.id,
          quantity: item.quantity,
          price: item.price,
          itemToppings: item.topping.map(topping => topping.id),
        })),
        deliveryAddress: { lat: 0, lng: 0, location: 'Texas, USA' },
      }
      console.log('payload ===>', payload);
      const res = await createOrder(payload);
      console.log('res order create ===>', res);
      ShowToast('success', 'Order placed successfully');
      AsyncStorage.setItem('cart', JSON.stringify([]));
      navigation.navigate('FoodOrderTracking');
    } catch (error) {
      console.error('Error placing order:', error);
      ShowToast('error', 'Cannot place order at the moment.');
    }
    // Handle order placement
  };

  const fetchOrderItems = async () => {
    try {
      const orderItems = await AsyncStorage.getItem('cart');
      if (orderItems) {
        setOrderItems(JSON.parse(orderItems));
        console.log('orderItems ===>', orderItems);
      }
    } catch (error) {
      console.error('Error fetching order items:', error);
    }
  }

  useEffect(() => {
    fetchOrderItems();
  }, [])

  return (
    <StripeProvider publishableKey={'pk_test_51RYtYNRT7PBrdzjovfRyXABozKiNkaAX0nJVTgfiiNpbDN719eYC4T88avnf0CtcWx7INMq51sUjPrFgUI7DL91x004gPiKy9u'}>
      <View style={[GeneralStyles.flex, styles.container]}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <PrimaryHeader
            title={'Checkout'}
            onBackPress={() => navigation.goBack()}
            onProfilePress={() => { }}
          />
        </View>

        {/* Map Carousel */}
        <View style={wishlistButtonStyles.carouselContainer}>
          <MainCarousel data={['https://assets.epicurious.com/photos/5988e3458e3ab375fe3c0caf/1:1/w_3607,h_3607,c_limit/How-to-Make-Chicken-Alfredo-Pasta-hero-02082017.jpg']} />
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
              <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Delivery Address</Text>
              {/* <View style={styles.addressInputRow}> */}
              <View style={[styles.addressInputContainer]}>
                <DestinationSearch
                  placeholder="Search for destination"
                  onSearchChange={() => { }}
                  onItemPress={(item) => {
                    console.log('item ===>', item);
                    setLandmark(item)
                  }}
                  showCurrentLocation={true}
                  currentLocation={undefined}
                />
              </View>
              {/* <TouchableOpacity
                style={[styles.targetButton, styles.shadowBox]}
                activeOpacity={0.7}
                onPress={() => {
                  // Handle target/location button press
                }}
              >
                <LocateFixed size={20} color={colors.black} />
              </TouchableOpacity>
            </View> */}
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
                  Name: <Text style={styles.infoTextValue}>{user?.name}</Text>
                </Text>
                <Text style={styles.infoText}>
                  Phone number:{' '}
                  <Text style={styles.infoTextValue}>{user?.phoneNumber}</Text>
                </Text>
                <Text style={styles.infoText}>
                  Address: <Text style={styles.infoTextValue}>{landmark?.destination}</Text>
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
                      <Text style={styles.orderItemLabel}>{item.name}</Text>
                      <Text style={styles.orderItemAmount}>
                        ${item.price.toFixed(2)}
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
                    ${route.params?.subTotal?.toFixed(2) || 0}
                  </Text>
                </View>
                <View style={styles.separatorLine} />

                {/* Coupon Discount */}
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Coupon discount</Text>
                  <Text style={styles.discountAmount}>
                    -${route.params?.couponDiscount?.toFixed(2) || 0}
                  </Text>
                </View>
                <View style={styles.separatorLine} />

                {/* Delivery Fee */}
                <View style={styles.summaryRow}>
                  <Text style={styles.deliveryFeeLabel}>Delivery Fee</Text>
                  <Text style={styles.summaryAmount}>
                    ${route.params?.deliveryFee?.toFixed(2) || 0}
                  </Text>
                </View>
                <View style={styles.dashedSeparatorLine} />

                {/* Total Amount */}
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalAmount}>${route.params?.total?.toFixed(2) || 0}</Text>
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
    </StripeProvider>
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
    // marginBottom: 24,
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
    // alignItems: 'center',
    gap: 12,
  },
  addressInputContainer: {
    width: '100%',
    minHeight: height * 0.09,
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
