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
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import HomeHeader from '../../../components/homeHeader/HomeHeader';
import images from '../../../config/images';
import GeneralStyles from '../../../utils/GeneralStyles';
import SearchWithFilters from '../../../components/searchWithFilters/SearchWithFilters';
import labels from '../../../config/labels';
import { height, width } from '../../../config/constants';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import ListWithIcon from '../../../components/listWithIcon/ListWithIcon';
import {
  FoodIconListArray,
} from '../../../constants/Food';
import FoodCard from '../../../components/foodCard/FoodCard';
import SectionHeader from '../../../components/sectionHeader/SectionHeader';
import FoodCardWithBorder from '../../../components/foodCardWithBorder/FoodCardWithBorder';
import FoodDrawerModal from '../../../components/drawerModal/FoodDrawerModal';
import { useLazyRestaurantGetQuery, useLazyGetPopularMenusQuery } from '../../../redux/services/restaurant.service';

const Home = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState([]);
  const [popularMenus, setPopularMenus] = useState<any[]>([]);
  const [loadingNewRestaurant, setLoadingNewRestaurant] = useState(true);
  const [loadingPopularMenus, setLoadingPopularMenus] = useState(true);
  const [restaurantGet] = useLazyRestaurantGetQuery();
  const [popularMenusGet] = useLazyGetPopularMenusQuery();

  const fetchData = async () => {
    setLoadingNewRestaurant(true);
    try {
      const res = await restaurantGet(1).unwrap();
      setNewRestaurant(res.data?.restaurants ?? []);
    } catch (error) {
      console.log('restaurant get error ===>', error);
    } finally {
      setLoadingNewRestaurant(false);
    }
  };

  const fetchPopularMenus = async () => {
    setLoadingPopularMenus(true);
    try {
      const res = await popularMenusGet(12).unwrap();
      setPopularMenus(res.data?.items ?? []);
    } catch (error) {
      console.log('popular menus error ===>', error);
    } finally {
      setLoadingPopularMenus(false);
    }
  };

  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      fetchData();
      fetchPopularMenus();
    });
    return subscribe;
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
          onFilterPress={() => navigation.navigate('FoodRestaurantFilter')}
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
          {loadingNewRestaurant ? (
            <View style={styles.newlyOpenedSkeletonWrap}>
              <SkeletonPlaceholder
                borderRadius={10}
                backgroundColor={colors.c_F3F3F3}
                highlightColor={colors.c_DDDDDD}
              >
                <View style={styles.newlyOpenedSkeletonRow}>
                  {[1, 2, 3, 4].map((i) => (
                    <View key={i} style={styles.newlyOpenedSkeletonCard}>
                      <View style={styles.newlyOpenedSkeletonImage} />
                      <View style={styles.newlyOpenedSkeletonTitle} />
                      <View style={styles.newlyOpenedSkeletonDesc} />
                    </View>
                  ))}
                </View>
              </SkeletonPlaceholder>
            </View>
          ) : (
            <FoodCard
              list={newRestaurant}
              navigation={navigation}
            />
          )}
        </View>

        {/* <HomeCarousel data={CarouselData as CarouselData[]} /> */}

        <View style={GeneralStyles.paddingHorizontal}>
          <SectionHeader title="Popular Food" onSeeAllPress={() => navigation.navigate('PopularFoodList')} />
        </View>

        {loadingPopularMenus ? (
          <View style={styles.popularFoodSkeletonWrap}>
            <SkeletonPlaceholder
              borderRadius={10}
              backgroundColor={colors.c_F3F3F3}
              highlightColor={colors.c_DDDDDD}
            >
              <View style={styles.popularFoodSkeletonGrid}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <View key={i} style={styles.popularFoodSkeletonCard}>
                    <View style={styles.popularFoodSkeletonImage} />
                    <View style={styles.popularFoodSkeletonTitle} />
                    <View style={styles.popularFoodSkeletonCategory} />
                    <View style={styles.popularFoodSkeletonPrice} />
                  </View>
                ))}
              </View>
            </SkeletonPlaceholder>
          </View>
        ) : (
          <FlatList
            data={popularMenus}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.menuGridContainer}
            columnWrapperStyle={styles.menuRow}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <View style={styles.menuCardWrapper}>
                <FoodCardWithBorder
                  image={item.image || images.foodHome}
                  title={item.name}
                  category={item.category || 'Food'}
                  rating={0}
                  price={item.price}
                  hasFreeship={false}
                  onPress={() => navigation.navigate('FoodDetails', { id: String(item.id), name: item.name, price: item.price, image: item.image || '', description: item.description || '', category: item.category || '', toppings: [] })}
                />
              </View>
            )}
          />
        )}
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
  newlyOpenedSkeletonWrap: {
    paddingLeft: 20,
    marginBottom: 8,
  },
  newlyOpenedSkeletonRow: {
    flexDirection: 'row',
    gap: 15,
  },
  newlyOpenedSkeletonCard: {
    width: 100,
  },
  newlyOpenedSkeletonImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  newlyOpenedSkeletonTitle: {
    width: '80%',
    height: 10,
    borderRadius: 4,
    marginTop: 10,
  },
  newlyOpenedSkeletonDesc: {
    width: '60%',
    height: 10,
    borderRadius: 4,
    marginTop: 6,
  },
  popularFoodSkeletonWrap: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  popularFoodSkeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  popularFoodSkeletonCard: {
    width: (width - 52) / 2,
    marginBottom: 12,
  },
  popularFoodSkeletonImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 10,
  },
  popularFoodSkeletonTitle: {
    width: '85%',
    height: 14,
    borderRadius: 4,
    marginBottom: 6,
  },
  popularFoodSkeletonCategory: {
    width: '50%',
    height: 12,
    borderRadius: 4,
    marginBottom: 6,
  },
  popularFoodSkeletonPrice: {
    width: '40%',
    height: 14,
    borderRadius: 4,
  },
});
