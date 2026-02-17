import {
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useState } from 'react';
import HomeHeader from '../../../components/homeHeader/HomeHeader';
import GeneralStyles from '../../../utils/GeneralStyles';
import images from '../../../config/images';
import fonts from '../../../config/fonts';
import colors from '../../../config/colors';
import { height } from '../../../config/constants';
import labels from '../../../config/labels';
import SearchWithFilters from '../../../components/searchWithFilters/SearchWithFilters';
import { NavigationProp } from '@react-navigation/native';
import LocationCard from '../../../components/locationCard/LocationCard';
import CarDrawerModal from '../../../components/drawerModal/CarDrawerModal';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';

const Home = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <View style={[GeneralStyles.flex, { backgroundColor: 'white' }]}>
      <ImageBackground
        source={images.car_home}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <HomeHeader
          navigation={navigation}
          onPress={() => setIsModalVisible(true)}
          bag={false}
        />
        <View style={styles.textContainer}>
          <Text style={styles.accomodationText}>{labels.foodDelivery}</Text>
          <View style={styles.divider} />
          <Text style={styles.stayInStyles}>{labels.hungryWeHave}</Text>
          <Text style={styles.liveInStyles}>{labels.gotYouCovered}</Text>
          <Text style={styles.stayComfortStyles}>
            {labels.riseAndShineBreakfast}
          </Text>
        </View>
        <SearchWithFilters
          placeholder={'Where to?'}
          navigation={navigation}
          filter={false}
          onFocus={() => {
            navigation?.navigate('RideHailingSearch');
          }}
        />
      </ImageBackground>

      <ScrollView contentContainerStyle={GeneralStyles.flexGrow}>
        <View style={styles.locationListContainer}>
          <FlatList
            data={[1, 2, 3]}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.locationListContentContainer}
            renderItem={() => (
              <LocationCard
                title="Location"
                description="Description"
                iconColor={colors.c_F47E20}
                onPress={() => {}}
                onBookmarkPress={() => {}}
                isBookmarked={false}
              />
            )}
          />
        </View>

        <View style={styles.bookRideButtonWrap}>
          <GradientButtonForAccomodation
            title="Book a ride"
            onPress={() => navigation?.navigate('BookARide' as never)}
            fontSize={16}
            fontFamily={fonts.bold}
            otherStyles={styles.bookRideButton}
          />
        </View>

        {/* <ImageBackground
          source={images.ride_home_traffic}
          style={styles.lowerImageStyles}
          resizeMode="stretch"
        ></ImageBackground> */}

        <CarDrawerModal
          visible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
        />
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  imageBackground: {
    height: height * 0.4,
    paddingHorizontal: 20,
    backgroundColor: colors.c_0162C0,
  },
  textContainer: { flex: 1, marginTop: 30 },

  accomodationText: {
    fontSize: 20,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  divider: {
    height: 3,
    borderRadius: 100,
    width: 124,
    backgroundColor: colors.white,
  },
  stayInStyles: {
    fontSize: 25,
    fontFamily: fonts.bold,
    color: colors.white,
    marginTop: 12,
  },
  stayComfortStyles: {
    marginTop: 10,
    fontSize: 11,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  liveInStyles: {
    fontSize: 25,
    fontFamily: fonts.bold,
    color: colors.white,
  },

  yourNextGatewayText: {
    fontSize: 20,
    fontFamily: fonts.medium,
    color: colors.black,
    marginTop: 25,
  },
  listContainer: {
    marginTop: 30,
  },
  paddingleft: {
    paddingLeft: 20,
  },
  gap: {
    gap: 20,
  },
  menuGridContainer: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  menuRow: {
    justifyContent: 'space-between',
    gap: 12,
  },
  menuCardWrapper: {
    flex: 1,
    marginBottom: 12,
  },
  scrollViewContent: {
    paddingBottom: 60,
  },
  lowerImageStyles: {
    flex: 1,
    backgroundColor: 'red',
  },
  locationListContainer: {
    // backgroundColor: 'blue',
  },
  locationListContentContainer: {
    gap: 16,
    paddingTop: 16,
    paddingLeft: 16,
  },
  bookRideButtonWrap: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  bookRideButton: {
    backgroundColor: colors.c_0162C0,
    borderRadius: 100,
    height: 50,
  },
});
