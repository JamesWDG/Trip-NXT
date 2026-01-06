import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useMemo, useState } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GeneralStyles from '../../../utils/GeneralStyles';
import FoodHeader from '../../../components/foodHeader/FoodHeader';
import CartItemCard from '../../../components/cartItemCard/CartItemCard';
import PaymentSummary from '../../../components/paymentSummary/PaymentSummary';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import images from '../../../config/images';
import { height } from '../../../config/constants';
import MainCarousel from '../../../components/mainCarousel/MainCarousel';
import { CarouselData } from '../../../constants/Accomodation';
import Divider from '../../../components/divider/Divider';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';

interface CartItem {
  id: string;
  image: any;
  title: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  quantity: number;
}

const Cart = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const { top } = useSafeAreaInsets();
  const [isFavorite, setIsFavorite] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      image: images.newly_opened || images.foodHome,
      title: 'Chicken burger Noodle Soup',
      description: 'Lorem Ipsum is simply dummy text',
      price: 24.0,
      rating: 4.8,
      reviewCount: 150,
      quantity: 1,
    },
    {
      id: '2',
      image: images.newly_opened || images.foodHome,
      title: 'Pretzel Chicken Noodle Soup',
      description: 'Lorem Ipsum is simply dummy text',
      price: 24.0,
      rating: 4.8,
      reviewCount: 150,
      quantity: 1,
    },
    {
      id: '3',
      image: images.newly_opened || images.foodHome,
      title: 'Pretzel Chicken Noodle Soup',
      description: 'Lorem Ipsum is simply dummy text',
      price: 24.0,
      rating: 4.8,
      reviewCount: 150,
      quantity: 1,
    },
  ]);

  const contentStyles = useMemo(() => makeContentStyles(top), [top]);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const couponDiscount = 5.5;
  const deliveryFee = 5.0;
  const subtotal = calculateSubtotal();
  const total = subtotal - couponDiscount + deliveryFee;

  const paymentSummaryItems = [
    { label: 'Subtotal', amount: subtotal },
    { label: 'Coupon discount', amount: couponDiscount, isDiscount: true },
    { label: 'Delivery Fee', amount: deliveryFee },
  ];

  const handleAddItem = () => {
    // Navigate to food home or add more items
    navigation?.navigate('Home');
  };

  const handleCheckout = () => {
    // Navigate to checkout screen
    console.log('Checkout pressed');

    navigation.navigate('FoodCheckout');
  };

  const wishlistButtonStyles = useMemo(() => {
    return wishlistButton(top);
  }, []);
  return (
    <View style={GeneralStyles.flex}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <FoodHeader
          onBackPress={() => navigation?.goBack()}
          onNotificationPress={() => {}}
          onCartPress={() => {}}
          onFavoritePress={() => setIsFavorite(!isFavorite)}
          isFavorite={isFavorite}
        />
      </View>

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
          {/* Section Title */}
          <Text style={styles.sectionTitle}>Cart</Text>

          {/* Cart Items */}
          {cartItems.map(item => (
            <>
              <CartItemCard
                key={item.id}
                image={item.image}
                title={item.title}
                description={item.description}
                price={item.price}
                rating={item.rating}
                reviewCount={item.reviewCount}
                quantity={item.quantity}
                onQuantityChange={newQuantity =>
                  handleQuantityChange(item.id, newQuantity)
                }
              />

              <Divider height={0.5} color={colors.lightGray} width="100%" />
            </>
          ))}

          {/* Payment Summary */}
          <PaymentSummary
            items={paymentSummaryItems}
            total={total}
            onPromoCodeChange={code => console.log('Promo code:', code)}
          />

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            {/* <TouchableOpacity
              style={styles.addItemButton}
              onPress={handleAddItem}
              activeOpacity={0.8}
            >
              <Text style={styles.addItemText}>Add Item</Text>
            </TouchableOpacity> */}
            <GradientButtonForAccomodation
              title="Add Item"
              onPress={handleAddItem}
              color={colors.black}
              fontSize={16}
              fontFamily={fonts.semibold}
              otherStyles={styles.addItemButton}
            />

            <GradientButtonForAccomodation
              title="Checkout"
              onPress={handleCheckout}
              fontSize={16}
              fontFamily={fonts.semibold}
              otherStyles={styles.checkoutButton}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Cart;

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
    scrollViewContent: { flexGrow: 1, paddingBottom: top + 50 },
    carouselContainer: {
      zIndex: 10,
      marginTop: -top + 20,
    },
  });
const styles = StyleSheet.create({
  backgroundImage: {
    height: height * 0.35,
    width: '100%',
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
    bottom: 20,
    left: 20,
    right: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 20,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  addItemButton: {
    flex: 1,
    height: 50,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.c_666666,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addItemText: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.black,
  },
  checkoutButton: {
    flex: 1,
    height: 50,
    borderRadius: 100,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutText: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
});
