import {
  Alert,
  Animated,
  Image,
  ImageSourcePropType,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useMemo, useRef, useState } from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle, MapPin, Star, Image as ImageIcon } from 'lucide-react-native';
import GeneralStyles from '../../../utils/GeneralStyles';
import FoodHeader from '../../../components/foodHeader/FoodHeader';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import Counter from '../../../components/counter/Counter';
import GradientButton from '../../../components/gradientButton/GradientButton';
import images from '../../../config/images';
import FastImage from 'react-native-fast-image';
import MainCarousel from '../../../components/mainCarousel/MainCarousel';
import { CarouselData } from '../../../constants/Accomodation';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import LinearGradient from 'react-native-linear-gradient';

interface ToppingOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

const FoodDetails = ({ navigation, route }: { navigation: NavigationProp<any>, route: RouteProp<{ params: { id: string, category: string, name: string, price: number, image: string, description: string, toppings: ToppingOption[] } }> }) => {
  const { top } = useSafeAreaInsets();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedTopping, setSelectedTopping] = useState<string>('3');
  const [quantity, setQuantity] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const wishlistButtonStyles = useMemo(() => {
    return wishlistButton(top);
  }, []);
  const toppingOptions: ToppingOption[] = [
    { id: '1', name: 'New hand tossed', price: 2.0, description: '' },
    { id: '2', name: 'Weat thin crust', price: 2.0, description: '' },
    { id: '3', name: 'Cheese burst', price: 5.0, description: '' },
    { id: '4', name: 'Fresh Pan Pizza', price: 5.0, description: '' },
    { id: '5', name: 'Classic Hand Tossed', price: 2.0, description: '' },
    { id: '6', name: 'Classic Tossed', price: 45.0, description: '' },
  ];

  const foodImage = images.newly_opened || images.foodHome;
  const foodName = 'Margherita Pizza';
  const location = 'New York City';
  const price = 24.0;
  const rating = 4.7;
  const photoCount = 99;
  const description =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

  const contentStyles = useMemo(() => makeContentStyles(top), [top]);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    navigation.navigate('FoodCart');
    const selectedToppingData = toppingOptions.find(
      t => t.id === selectedTopping,
    );
    console.log('Add to cart:', {
      foodName,
      quantity,
      topping: selectedToppingData,
      totalPrice: price + (selectedToppingData?.price || 0),
    });
    // Navigate to cart or show success message
  };

  const onPressGoReviews = () => {
    navigation.navigate('FoodReviews');
  };

  const handleOrderSuccess = () => {
    setShowSuccessModal(true);
    // Animate modal appearance
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSuccessModal = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowSuccessModal(false);
    });
  };

  return (
    <View style={GeneralStyles.flex}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <FoodHeader
          onBackPress={() => navigation?.goBack()}
          onNotificationPress={() => { }}
          onCartPress={() => { }}
          onFavoritePress={() => setIsFavorite(!isFavorite)}
          isFavorite={isFavorite}
        />
      </View>

      <View style={wishlistButtonStyles.carouselContainer}>
        <MainCarousel data={[route.params.image]} />
      </View>
      {/* Food Image */}
      {/* <View style={styles.imageContainer}>
        {typeof foodImage === 'string' ? (
          <FastImage
            source={{ uri: foodImage } as any}
            style={styles.foodImage}
            resizeMode="cover"
          />
        ) : (
          <Image
            source={foodImage as ImageSourcePropType}
            style={styles.foodImage}
            resizeMode="cover"
          />
        )}
      </View> */}

      {/* White Content Card */}
      <View style={contentStyles.contentCard}>
        <ScrollView
          style={GeneralStyles.flex}
          contentContainerStyle={contentStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Food Name, Location, and Price */}
          <View style={styles.nameLocationContainer}>
            <View style={styles.nameLocationLeft}>
              <Text style={styles.foodName}>{route?.params?.name}</Text>
              {/* <View style={styles.locationRow}>
                <MapPin size={14} color={colors.c_EE4026} />
                <Text style={styles.location}>{location}</Text>
              </View> */}
            </View>
            <Text style={styles.price}>${route?.params?.price}</Text>
          </View>

          {/* Rating and Photo Count */}
          {/* <View style={styles.ratingPhotoContainer}>
            <View style={styles.ratingBadge}>
              <View style={styles.badgeIconContainer}>
                <Star size={16} color={colors.white} fill={colors.white} />
              </View>
              <View style={styles.badgeContent}>
                <Text style={styles.badgeValue}>{rating}</Text>
                <Text style={styles.badgeLabel}>Rating</Text>
              </View>
            </View>

            <View style={styles.photoBadge}>
              <View style={[styles.badgeIconContainer, styles.blueBadge]}>
                <ImageIcon size={16} color={colors.white} />
              </View>
              <View style={styles.badgeContent}>
                <Text style={styles.badgeValue}>{photoCount}+</Text>
                <Text style={styles.badgeLabel}>Photo</Text>
              </View>
            </View>
          </View> */}

          {/* <View style={styles.ratingsMainContainer}>
            <View style={styles.ratingContainers}>
              <View style={styles.badgeIconContainer}>
                <Star size={25} color={colors.white} fill={colors.white} />
              </View>
              <View style={styles.badgeContent}>
                <Text style={styles.badgeValue}>{rating}</Text>
                <Text style={styles.badgeLabel}>Rating</Text>
              </View>
            </View>
            <View style={styles.ratingContainers}>
              <View style={[styles.badgeIconContainer, styles.blueBadge]}>
                <ImageIcon size={25} color={colors.white} />
              </View>
              <View style={styles.badgeContent}>
                <Text style={styles.badgeValue}>{rating}</Text>
                <Text style={styles.badgeLabel}>Rating</Text>
              </View>
            </View>
          </View> */}
          {/* Food Detail Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Food Detail</Text>
            <Text style={styles.description}>{route?.params?.description}</Text>
          </View>

          {/* Add Topping Section */}
         {route?.params?.toppings?.length > 0 && <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add Topping</Text>
            {route?.params?.toppings?.map(topping => (
              <TouchableOpacity
                key={topping.id}
                style={styles.toppingOption}
                onPress={() => setSelectedTopping(topping.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.toppingText}>
                  {topping.name} +${topping.price.toFixed(2)}
                </Text>
                <View
                  style={[
                    styles.radioButton,
                    selectedTopping === topping.id && styles.radioSelected,
                  ]}
                >
                  {selectedTopping === topping.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>}

          {/* Quantity and Add to Cart */}
          <View style={styles.quantityCartContainer}>
            <View style={styles.quantitySection}>
              <Text style={styles.quantityLabel}>Quantity:</Text>
              <View style={styles.quantitySelector}>
                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                    quantity === 1 && styles.quantityButtonDisabled,
                  ]}
                  onPress={handleDecrease}
                  disabled={quantity === 1}
                >
                  <Text
                    style={[
                      styles.quantityButtonText,
                      quantity === 1 && styles.quantityButtonTextDisabled,
                    ]}
                  >
                    −
                  </Text>
                </TouchableOpacity>
                <Text style={styles.quantityValue}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={handleIncrease}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.cartButtonContainer}>
              {/* <GradientButtonForAccomodation
                title="Add to Cart"
                onPress={handleAddToCart}
                fontSize={16}
                fontFamily={fonts.semibold}
                otherStyles={styles.cartButton}
              /> */}
              <GradientButtonForAccomodation
                title="Buy Now"
                onPress={handleOrderSuccess}
                fontSize={16}
                fontFamily={fonts.semibold}
                otherStyles={styles.cartButton}
              />
            </View>
          </View>
          <GradientButtonForAccomodation
            title="Check Reviews"
            onPress={onPressGoReviews}
            fontSize={16}
            fontFamily={fonts.semibold}
            otherStyles={{ marginTop: 30 }}
          />
        </ScrollView>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="none"
        onRequestClose={closeSuccessModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.modalContent}>
              <View style={styles.successIconContainer}>
                <CheckCircle size={80} color={colors.c_F47E20} fill={colors.c_F47E20} />
              </View>
              <Text style={styles.modalTitle}>Order Placed Successfully!</Text>
              <Text style={styles.modalMessage}>
                Your order has been confirmed and will be delivered soon.
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={closeSuccessModal}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#F47E20', '#EE4026']}
                  style={styles.modalButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.modalButtonText}>Continue Shopping</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default FoodDetails;

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
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  imageContainer: {
    width: '100%',
    height: 300,
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  nameLocationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  nameLocationLeft: {
    flex: 1,
    marginRight: 12,
  },
  foodName: {
    fontSize: 20,
    fontFamily: fonts.semibold,
    color: colors.black,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  location: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  price: {
    fontSize: 17,
    fontFamily: fonts.semibold,
    color: colors.c_F47E20,
  },
  ratingPhotoContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.c_F47E20,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  photoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  badgeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: colors.c_F47E20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingContainers: {
    // backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ratingsMainContainer: {
    flexDirection: 'row',
    gap: 25,
    marginTop: 10,
    marginBottom: 20,
  },
  blueBadge: { backgroundColor: colors.primary },
  badgeContent: {
    alignItems: 'center',
  },
  badgeValue: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.black,
  },
  badgeLabel: {
    fontSize: 10,
    fontFamily: fonts.normal,
    color: colors.black,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.semibold,
    color: colors.black,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    lineHeight: 20,
  },
  toppingOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.c_F3F3F3,
  },
  toppingText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    // borderColor: colors.c_F47E20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: colors.c_F47E20,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.c_F47E20,
  },
  quantityCartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
    gap: 16,
  },
  quantitySection: {
    flex: 1,
  },
  quantityLabel: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.black,
    marginBottom: 8,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.c_F47E20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: colors.c_F3F3F3,
  },
  quantityButtonText: {
    fontSize: 20,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  quantityButtonTextDisabled: {
    color: colors.c_CFD1D3,
  },
  quantityValue: {
    fontSize: 18,
    fontFamily: fonts.semibold,
    color: colors.black,
    minWidth: 30,
    textAlign: 'center',
  },
  cartButtonContainer: {
    flex: 1.01,
  },
  cartButton: {
    height: 50,
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  successIconContainer: {
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  modalButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
});
