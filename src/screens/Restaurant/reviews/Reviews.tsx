import {
  FlatList,
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useMemo, useState } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, Star, Image as ImageIcon } from 'lucide-react-native';
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
import RestaurantTabButtons from '../../../components/restaurantTabButtons/RestaurantTabButtons';
import FoodReviewCard from '../../../components/foodReviewCard/FoodReviewCard';

interface ToppingOption {
  id: string;
  name: string;
  price: number;
}

const Reviews = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const { top } = useSafeAreaInsets();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedTopping, setSelectedTopping] = useState<string>('3');
  const [quantity, setQuantity] = useState(1);

  const wishlistButtonStyles = useMemo(() => {
    return wishlistButton(top);
  }, []);
  const toppingOptions: ToppingOption[] = [
    { id: '1', name: 'New hand tossed', price: 2.0 },
    { id: '2', name: 'Weat thin crust', price: 2.0 },
    { id: '3', name: 'Cheese burst', price: 5.0 },
    { id: '4', name: 'Fresh Pan Pizza', price: 5.0 },
    { id: '5', name: 'Classic Hand Tossed', price: 2.0 },
    { id: '6', name: 'Classic Tossed', price: 45.0 },
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
        <MainCarousel data={['https://assets.epicurious.com/photos/5988e3458e3ab375fe3c0caf/1:1/w_3607,h_3607,c_limit/How-to-Make-Chicken-Alfredo-Pasta-hero-02082017.jpg', 'https://assets.epicurious.com/photos/5988e3458e3ab375fe3c0caf/1:1/w_3607,h_3607,c_limit/How-to-Make-Chicken-Alfredo-Pasta-hero-02082017.jpg']} />
      </View>

      <View style={contentStyles.contentCard}>
        {/* <ScrollView
          style={GeneralStyles.flex}
          contentContainerStyle={contentStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        > */}
        <RestaurantTabButtons
          data={['Top Reviews', 'Newests', 'Highest Rating', 'Lowest Rating']}
        />

        <FlatList
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          renderItem={({ item }) => (
            <FoodReviewCard
              reviewerName="Floyd Miles"
              rating={5}
              timeAgo="2 Days Ago"
              reviewComment="Improve Chicken Quality"
              likedDishCount={1}
              dish={{
                image: images.newly_opened || images.foodHome,
                name: '1 Zinger Cheez Crispy Burger',
                price: 150.0,
              }}
              helpfulCount={8}
            />
          )}
          keyExtractor={item => item.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            // paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: top + 50,
          }}
        />
        {/* </ScrollView> */}
      </View>
    </View>
  );
};

export default Reviews;

const makeContentStyles = (top: number) =>
  StyleSheet.create({
    contentCard: {
      flex: 1,
      backgroundColor: colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginTop: -90,
      zIndex: 999,
      gap: 20,
      paddingTop: 35,
      paddingHorizontal: 20,
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
});
