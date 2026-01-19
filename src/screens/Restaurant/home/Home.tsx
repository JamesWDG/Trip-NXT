import {
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationProp } from '@react-navigation/native';
import HomeHeader from '../../../components/homeHeader/HomeHeader';
import images from '../../../config/images';
import GeneralStyles from '../../../utils/GeneralStyles';
import SearchWithFilters from '../../../components/searchWithFilters/SearchWithFilters';
import labels from '../../../config/labels';
import { height } from '../../../config/constants';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import ListWithIcon from '../../../components/listWithIcon/ListWithIcon';
import {
  FoodIconListArray,
  FoodListCardType,
} from '../../../constants/Food';
import FoodCard from '../../../components/foodCard/FoodCard';
import { CarouselData } from '../../../constants/Accomodation';
import HomeCarousel from '../../../components/homeCarousel/HomeCarousel';
import SectionHeader from '../../../components/sectionHeader/SectionHeader';
import FoodCardWithBorder from '../../../components/foodCardWithBorder/FoodCardWithBorder';
import FoodDrawerModal from '../../../components/drawerModal/FoodDrawerModal';
import { useLazyRestaurantGetQuery } from '../../../redux/services/restaurant.service';
const Home = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState([]);
  const [restaurantGet, { data, isLoading }] = useLazyRestaurantGetQuery();

  const fetchData = async () => {
    try {
      const res = await restaurantGet(1).unwrap();
      console.log("restaurant get response ===>", res);
      setNewRestaurant(res.data.restaurants);
    } catch (error) {
      console.log("restaurant get error ===>", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={[GeneralStyles.flex, { backgroundColor: 'white' }]}>
      <ImageBackground
        source={images.foodHome}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <HomeHeader
          navigation={navigation}
          onPress={() => setIsModalVisible(true)}
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
          placeholder={labels.whatDoYouWantToEat}
          navigation={navigation}
        />
      </ImageBackground>

      <ScrollView
        contentContainerStyle={[
          GeneralStyles.flexGrow,
          styles.scrollViewContent,
        ]}
        horizontal={false}
        showsVerticalScrollIndicator={false}
        style={GeneralStyles.flex}
      >
        <View style={styles.listContainer}>
          <ListWithIcon list={FoodIconListArray} height={60} width={60} />
        </View>

        <View style={[styles.gap]}>
          <View style={GeneralStyles.paddingHorizontal}>
            <SectionHeader
              title="Newly Opened"
              onSeeAllPress={() => navigation.navigate('FoodRestaurantInfo')}
            />
          </View>
          <FoodCard
            list={newRestaurant}
            navigation={navigation}
          />
        </View>

        <HomeCarousel data={CarouselData as CarouselData[]} />

        <View style={GeneralStyles.paddingHorizontal}>
          <SectionHeader title="Popular Food" onSeeAllPress={() => {}} />
        </View>

        <FlatList
          data={[1, 2, 3, 4, 5, 6]}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.menuGridContainer}
          columnWrapperStyle={styles.menuRow}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.menuCardWrapper}>
              <FoodCardWithBorder
                image={images.foodHome}
                title="Pretzel Chicken Noodle Soup - Regular"
                category="Noodles"
                rating={4.7}
                price={35}
                hasFreeship={true}
                onPress={() => navigation.navigate('FoodDetails')}
              />
            </View>
          )}
        />
        <FoodDrawerModal
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
    paddingBottom: 100,
  },
});
