import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, { useMemo, useState } from 'react';
import PrimaryHeader from '../../../components/primaryHeader/PrimaryHeader';
import MainCarousel from '../../../components/mainCarousel/MainCarousel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../../config/colors';
import {
  Heart,
} from 'lucide-react-native';
import DetailsCard from '../../../components/detailsCard/DetailsCard';
import images from '../../../config/images';
import fonts from '../../../config/fonts';
import IntroCard from '../../../components/introCard/IntroCard';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import GeneralStyles from '../../../utils/GeneralStyles';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { AccomodationCard } from '../../../constants/Accomodation';

const HotelDetails = ({ navigation, route }: { navigation?: any, route: RouteProp<{ params: { hotel: AccomodationCard } }> }) => {
  const { top } = useSafeAreaInsets();
  const [wishlist, setWishlist] = useState(false);
  const nav = useNavigation<any>();

  const wishlistButtonStyles = useMemo(() => {
    return wishlistButton(wishlist, top);
  }, [wishlist]);
  return (
    <View style={GeneralStyles.flex as ViewStyle}>
      <View style={styles.headerContainer}>
        <PrimaryHeader
          title="Hotel Details"
          onBackPress={() => navigation.goBack()}
          onProfilePress={() => navigation.navigate('Profile')}
        />
      </View>
      <View style={wishlistButtonStyles.carouselContainer}>
        <MainCarousel data={route.params?.hotel?.images.length > 0 ? route.params?.hotel?.images : [images.placeholder]} />
      </View>

      <View style={styles.lowerContainer}>
        <ScrollView
          style={GeneralStyles.flex}
          contentContainerStyle={wishlistButtonStyles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <DetailsCard
            title={route.params?.hotel?.name}
            reviews={11}
            rating={route.params?.hotel?.rating || 10}
            rentPerDay={route.params?.hotel?.rentPerDay}
            rentPerHour={route.params?.hotel?.rentPerHour}
            location={(route.params?.hotel?.location?.city || '') + ', ' + (route.params?.hotel?.location?.state || '') + ', ' + (route.params?.hotel?.location?.country || '')}
            description={route.params?.hotel?.description}
            numberOfBeds={route.params?.hotel?.numberOfBeds}
            numberOfBathrooms={route.params?.hotel?.numberOfBathrooms}
            numberOfGuests={route.params?.hotel?.numberOfGuests}
            features={route.params?.hotel?.features || []}
          />

          <View
            style={[styles.locationContainer, styles.paddingHorizontalStyle]}
          >
            <Text style={styles.locationTitle}>Location/Map</Text>
            <Text style={styles.locationText}>View on Google MAP</Text>
          </View>

          <View
            style={[styles.paddingHorizontalStyle, styles.introCardContainer]}
          >
            <IntroCard
              name={route.params?.hotel?.owner?.name}
              rating={route.params?.hotel?.rating || 10}
              reviews={11}
              yearsHosting={10}
              image={route.params?.hotel?.owner?.profilePicture}
              description={`CEO, ${route.params?.hotel?.name}`}
              designation={`CEO, ${route.params?.hotel?.name}`}
            />
          </View>

          <View style={styles.wishlistContainer}>
            <TouchableOpacity
              onPress={() => setWishlist(!wishlist)}
              style={wishlistButtonStyles.container}
            >
              <Heart
                color={wishlist ? colors.white : colors.c_F47E20}
                size={26}
              />
            </TouchableOpacity>
            <View style={GeneralStyles.flex}>
              <GradientButtonForAccomodation
                title="Book Now"
                onPress={() => {
                  console.log('route.params?.hotel', route.params?.hotel?.id);
                  (navigation || nav).navigate('CalenderBooking', { hotelId: route.params?.hotel?.id, ownerId: route.params?.hotel?.ownerId })
                }}
                fontSize={18}
                fontFamily={fonts.semibold}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default HotelDetails;

const wishlistButton = (wishlist: boolean, top: number) =>
  StyleSheet.create({
    container: {
      backgroundColor: wishlist ? colors.c_F47E20 : colors.transparent,
      padding: 10,
      borderRadius: 100,
      borderWidth: 1,
      borderColor: wishlist ? colors.c_F47E20 : colors.transparent,
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scrollViewContent: { flexGrow: 1, paddingBottom: top + 20 },
    carouselContainer: {
      zIndex: 10,
      marginTop: -top - 20,
    },
  });
const styles = StyleSheet.create({
  lowerContainer: {
    flex: 1,
    backgroundColor: colors.white,
    zIndex: 999,
    marginTop: -90,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  locationTitle: {
    fontSize: 20,
    fontFamily: fonts.semibold,
  },
  locationText: {
    fontSize: 12,
    fontFamily: fonts.normal,
    textDecorationColor: 'underline',
    textDecorationLine: 'underline',
  },
  paddingHorizontalStyle: {
    paddingHorizontal: 20,
  },
  introCardContainer: {
    marginTop: 20,
  },
  wishlistContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 15,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
});
