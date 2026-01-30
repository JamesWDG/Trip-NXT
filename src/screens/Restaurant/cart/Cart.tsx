import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GeneralStyles from '../../../utils/GeneralStyles';
import FoodHeader from '../../../components/foodHeader/FoodHeader';
import CartItemCard from '../../../components/cartItemCard/CartItemCard';
import PaymentSummary from '../../../components/paymentSummary/PaymentSummary';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import { height, width } from '../../../config/constants';
import Divider from '../../../components/divider/Divider';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CartSkeleton from '../../../components/cartSkeleton/CartSkeleton';
import DeleteItemModal from '../../../components/deleteItemModal/DeleteItemModal';
import { CartItem, Topping } from '../../../constants/Food';
import { useLazyGetItemWithIdQuery } from '../../../redux/services/restaurant.service';

const Cart = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const { top } = useSafeAreaInsets();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CartItem | null>(null);
  const [getItemWithId] = useLazyGetItemWithIdQuery();

  const contentStyles = useMemo(() => makeContentStyles(top), [top]);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    const updatedItems = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item,
    );
    setCartItems(updatedItems);
    // Update AsyncStorage
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const handleDeleteItem = (item: CartItem) => {
    setItemToDelete(item);
    setDeleteModalVisible(true);
  };

  const confirmDeleteItem = async () => {
    if (itemToDelete) {
      const updatedItems = cartItems.filter(item => item.id !== itemToDelete.id);
      setCartItems(updatedItems);     
      // Update AsyncStorage
      try {
        await AsyncStorage.setItem('cart', JSON.stringify(updatedItems));
      } catch (error) {
        console.error('Error updating cart:', error);
      }
      
      setDeleteModalVisible(false);
      setItemToDelete(null);
    }
  };

  const cancelDeleteItem = () => {
    setDeleteModalVisible(false);
    setItemToDelete(null);
  };

  const couponDiscount = 0;
  const deliveryFee = 5.0;

  const paymentSummaryItems = useMemo(() => {
    const toppingPrice = cartItems.reduce((sum, item) => sum + (item.topping.reduce((sum, topping) => sum + topping.price, 0) || 0), 0);
    return [
      { label: 'Subtotal', amount: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + toppingPrice },
      { label: 'Coupon discount', amount: couponDiscount, isDiscount: true },
      { label: 'Delivery Fee', amount: deliveryFee },
    ];
  }, [cartItems]);

  

  const handleAddItem = () => {
    // Navigate to food home or add more items
    navigation?.navigate('FoodHome');
  };

  const handleCheckout = () => {
    // Navigate to checkout screen
    console.log('Checkout pressed');

    navigation.navigate('FoodCheckout', {
      total: paymentSummaryItems.reduce((sum, item) => sum + item.amount, 0),
      subTotal: paymentSummaryItems[0].amount,
      deliveryFee: paymentSummaryItems[2].amount,
      couponDiscount: paymentSummaryItems[1].amount,
    });
  };

  const wishlistButtonStyles = useMemo(() => {
    return wishlistButton(top);
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const cartItems = await AsyncStorage.getItem('cart');
      if (cartItems) {
        // setCartItems(JSON.parse(cartItems));
        const cartItemsArray:CartItem[] = JSON.parse(cartItems);
        const itemIds = cartItemsArray.map((item) => item.id);
        const params = itemIds.join(',');
        console.log('params ===>', params);
        const res = await getItemWithId(params).unwrap();
        console.log('res ===>', res);
        const updatedArr:CartItem[] = [];
        res?.data?.forEach((item: Omit<CartItem, 'topping'> & {toppings: Topping[]}) => {
          const found = cartItemsArray.find((cartItem) => cartItem.id === item.id);
          if (found) {
            let tempTopping: Topping[] = [];
            if (found?.topping && found?.topping.length > 0) {
              const toppingNames = found?.topping.map((topping) => topping.name);
              const toppingItems = item?.toppings?.filter((topping) => toppingNames.includes(topping.name));
              tempTopping = [...toppingItems];
            }
            updatedArr.push({
              ...item,
              quantity: found?.quantity,
              rating: found?.rating,
              reviewCount: found?.reviewCount,
              topping: tempTopping,
            })
          }
        })
        await AsyncStorage.setItem('cart', JSON.stringify(updatedArr));
        setCartItems(updatedArr);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchCartItems();
  },[])

  if (loading) {
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
        <CartSkeleton />
      </View>
    );
  }

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
        {/* <MainCarousel data={['https://assets.epicurious.com/photos/5988e3458e3ab375fe3c0caf/1:1/w_3607,h_3607,c_limit/How-to-Make-Chicken-Alfredo-Pasta-hero-02082017.jpg','https://assets.epicurious.com/photos/5988e3458e3ab375fe3c0caf/1:1/w_3607,h_3607,c_limit/How-to-Make-Chicken-Alfredo-Pasta-hero-02082017.jpg']} /> */}
        <ImageBackground
        source={{uri: cartItems[0]?.image || 'https://assets.epicurious.com/photos/5988e3458e3ab375fe3c0caf/1:1/w_3607,h_3607,c_limit/How-to-Make-Chicken-Alfredo-Pasta-hero-02082017.jpg'}}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
      >
      </ImageBackground>
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
          { cartItems.length > 0 && cartItems.map(item => (
            <View key={item.id}>
              <CartItemCard
                image={item.image}
                title={item.name}
                description={item.description}
                price={item.price}
                rating={item.rating}
                reviewCount={item.reviewCount}
                quantity={item.quantity}
                onQuantityChange={newQuantity =>
                  handleQuantityChange(item.id, newQuantity)
                }
                onDelete={() => handleDeleteItem(item)}
                topping={item?.topping || []}
              />

              <Divider height={0.5} color={colors.lightGray} width="100%" />
            </View>
          ))}

          {/* Payment Summary */}
          <PaymentSummary
            items={paymentSummaryItems}
            total={paymentSummaryItems.reduce((sum, item) => sum + item.amount, 0)}
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
              otherStyles={[{backgroundColor: cartItems.length === 0 ? colors.lightGray : colors.primary,},styles.checkoutButton]}
              disabled={cartItems.length === 0}
            />
          </View>
        </ScrollView>
      </View>

      {/* Delete Item Modal */}
      <DeleteItemModal
        visible={deleteModalVisible}
        itemName={itemToDelete?.name}
        onConfirm={confirmDeleteItem}
        onCancel={cancelDeleteItem}
      />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutText: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  imageBackground: {
    height: height * 0.4,
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageStyle: {
    width: width * 1,
    height: height * 0.4,
    borderRadius: 10,
  },
});
