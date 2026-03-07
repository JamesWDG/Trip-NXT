import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { NavigationProp, ParamListBase, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GeneralStyles from '../../../utils/GeneralStyles';
import FoodHeader from '../../../components/foodHeader/FoodHeader';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import MainCarousel from '../../../components/mainCarousel/MainCarousel';
import FoodReviewCard from '../../../components/foodReviewCard/FoodReviewCard';
import { useLazyGetReviewsByMenuItemIdQuery } from '../../../redux/services/review.service';
import ReviewsSkeleton from '../../../components/reviewsSkeleton/ReviewsSkeleton';

interface ReviewsProps {
  navigation: NavigationProp<ParamListBase, string>;
  route: RouteProp<{
    params: {
      id: string;
    }
  }>
}

type Review = {
  id: number;
  userId: number;
  referenceId: number;
  referenceType: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  item: {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    isActive: boolean;
    restaurantId: number;
    createdAt: string;
    updatedAt: string;
  };
  user: {
    id: number;
    profilePicture: string | null;
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    address: string | null;
    role: string[];
    isActive: boolean;
  }
}
const Reviews = ({ navigation, route }: ReviewsProps) => {
  const { top } = useSafeAreaInsets();
  const [getReviewsByMenuItemId] = useLazyGetReviewsByMenuItemIdQuery();
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  // const [isFavorite, setIsFavorite] = useState(false);

  const wishlistButtonStyles = useMemo(() => {
    return wishlistButton(top);
  }, []);

  const contentStyles = useMemo(() => makeContentStyles(top), [top]);

  const fetchReviewsByMenuItemId = async () => {
    try {
      setLoading(true);
      const res = await getReviewsByMenuItemId(parseInt(route.params.id)).unwrap();
      console.log('reviews by menu item id response ===>', res, route.params.id);
      setReviews(res.data);
    } catch (error) {
      console.log('reviews by menu item id error ===>', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReviewsByMenuItemId();
  }, [route.params])

  if (loading) {
    return (
      <View style={GeneralStyles.flex}>
        <View style={styles.headerContainer}>
          <FoodHeader
            onBackPress={() => navigation?.goBack()}
            onNotificationPress={() => { }}
            onCartPress={() => { }}
            onFavoritePress={() => { }}
            isFavorite={false}
            showFavorite={false}
          />
        </View>
        <ReviewsSkeleton />
      </View>
    );
  }

  return (
    <View style={GeneralStyles.flex}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <FoodHeader
          onBackPress={() => navigation?.goBack()}
          onNotificationPress={() => { }}
          onCartPress={() => { }}
          onFavoritePress={() => { }}
          isFavorite={false}
          showFavorite={false}
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
        {/* <RestaurantTabButtons
          data={['Top Reviews', 'Newests', 'Highest Rating', 'Lowest Rating']}
        /> */}

        <FlatList
          data={reviews}
          renderItem={({ item }) => (
            <FoodReviewCard
              reviewerName={item.user.name}
              rating={item.rating}
              timeAgo={item.createdAt}
              reviewComment={item.comment}
              likedDishCount={0}
              dish={{
                image: { uri: item.item.image },
                name: item.item.name,
                price: item.item.price,
              }}
            // helpfulCount={item.helpfulCount}
            />
          )}
          keyExtractor={item => item.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            // paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: top + 50,
          }}
          ListEmptyComponent={() => (<View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No reviews yet</Text>
          </View>
          )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.black,
  },
});
