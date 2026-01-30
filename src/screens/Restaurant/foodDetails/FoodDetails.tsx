import {
  Alert,
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GeneralStyles from '../../../utils/GeneralStyles';
import FoodHeader from '../../../components/foodHeader/FoodHeader';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import MainCarousel from '../../../components/mainCarousel/MainCarousel';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import images from '../../../config/images';

interface ToppingOption {
  id: number;
  name: string;
  price: number;
  description: string;
}

const FoodDetails = ({ navigation, route }: { navigation: NavigationProp<any>, route: RouteProp<{ params: { id: string, category: string, name: string, price: number, image: string, description: string, toppings: ToppingOption[] } }> }) => {
  const { top } = useSafeAreaInsets();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedTopping, setSelectedTopping] = useState<number[]>([]);
  const [quantity, setQuantity] = useState(1);

  const wishlistButtonStyles = useMemo(() => {
    return wishlistButton(top);
  }, []);


  const contentStyles = useMemo(() => makeContentStyles(top), [top]);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = async () => {
    const cartItems = await AsyncStorage.getItem('cart');
    console.log('cartItems ===>', cartItems);
    if (!cartItems) {
      await AsyncStorage.setItem('cart', JSON.stringify([{
        name: route?.params?.name,
        quantity,
        topping: route?.params?.toppings?.filter(topping => selectedTopping.includes(topping.id)),
        price: route?.params?.price,
        id: route?.params?.id,
        image: route.params.image,
        description: route?.params?.description,
        category: route?.params?.category,
      }]));
      navigation.navigate('FoodCart');
      return;
    }
    const cartItemsArray = JSON.parse(cartItems);
    let found = cartItemsArray.find((item: any) => item.id === route?.params?.id);
    if (found) {
      found.quantity = quantity;
      found.topping = route?.params?.toppings?.filter(topping => selectedTopping.includes(topping.id));
      found.price = route?.params?.price;
      found.image = route.params.image;
      found.description = route?.params?.description;
      found.category = route?.params?.category;
    } else {
      cartItemsArray.push({
        name: route?.params?.name,
        quantity,
        topping: route?.params?.toppings?.filter(topping => selectedTopping.includes(topping.id)),
        price: route?.params?.price,
        id: route?.params?.id,
        image: route.params.image,
        description: route?.params?.description,
        category: route?.params?.category,
      });
    }
    console.log('cartItemsArray ===>', cartItemsArray);
    await AsyncStorage.setItem('cart', JSON.stringify(cartItemsArray));
    navigation.navigate('FoodCart');
  };

  const onPressGoReviews = () => {
    navigation.navigate('FoodReviews');
  };

  const handleSelectTopping = (toppingId: number) => {
    if (selectedTopping.includes(toppingId)) {
      setSelectedTopping(selectedTopping.filter(id => id !== toppingId));
    } else {
      setSelectedTopping([...selectedTopping, toppingId]);
    }
  }

  const fetchCartItems = async () => {
    const cartItems = await AsyncStorage.getItem('cart');
    if (cartItems) {
      const cartItemsArray = JSON.parse(cartItems);
      console.log('cartItemsArray ===>', cartItemsArray);
      const found = cartItemsArray.find((item: any) => item.id === route?.params?.id);
      if (found) {
        setSelectedTopping(found.topping.map((topping: any) => topping.id));
        setQuantity(found.quantity);
      }
    }
  }

  useEffect(()=>{
    fetchCartItems();
  },[route.params])

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
        <MainCarousel data={[route?.params?.image || images.placeholder]} />
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
              <View key={topping.id} style={styles.toppingOption}>
                <Text style={styles.toppingText}>
                  {topping.name} +${topping.price.toFixed(2)}
                </Text>
                <CheckBox
                  value={selectedTopping.includes(topping.id)}
                  onValueChange={() => handleSelectTopping(topping.id)}
                  tintColor={colors.c_F47E20}
                  onCheckColor={colors.white}
                  onTintColor={colors.c_F47E20}
                  onFillColor={colors.c_F47E20}
                  style={styles.checkbox}
                />
              </View>
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
              <GradientButtonForAccomodation
                title="Add to Cart"
                onPress={handleAddToCart}
                fontSize={16}
                fontFamily={fonts.semibold}
                otherStyles={styles.cartButton}
              />
              {/* <GradientButtonForAccomodation
                title="Buy Now"
                onPress={() => Alert.alert('Order Placed Successfully')}
                fontSize={16}
                fontFamily={fonts.semibold}
                otherStyles={styles.cartButton}
              /> */}
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
  checkbox: {
    width: 22,
    height: 22,
  },
  quantityCartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    // marginTop: 8,
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
    flex: 1,
  },
  cartButton: {
    height: 50,
    width: '100%',
  },
});
