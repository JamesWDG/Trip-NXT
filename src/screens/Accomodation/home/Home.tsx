import {
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import images from '../../../config/images';
import { height, width } from '../../../config/constants';
import colors from '../../../config/colors';
import HomeHeader from '../../../components/homeHeader/HomeHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import fonts from '../../../config/fonts';
import SearchWithFilters from '../../../components/searchWithFilters/SearchWithFilters';
import labels from '../../../config/labels';
import ListWithIcon from '../../../components/listWithIcon/ListWithIcon';
import {
  CarouselData,
  IconListArray,
} from '../../../constants/Accomodation';
import AccomodationCard from '../../../components/accomodationCard/AccomodationCard';
import HomeCarousel from '../../../components/homeCarousel/HomeCarousel';
import SectionHeader from '../../../components/sectionHeader/SectionHeader';
import { RecommendedCard } from '../../dummyPage/DummyPage';
import DrawerModal from '../../../components/drawerModal/DrawerModal';
import { useNavigation } from '@react-navigation/native';
import GeneralStyles from '../../../utils/GeneralStyles';
import { useLazyGetHotelsQuery } from '../../../redux/services/hotel.service';

type HotelItem = {
  id?: number;
  name?: string;
  images?: string[];
  rentPerDay?: number;
  location?: { city?: string; state?: string; country?: string };
};

const Home = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loadingHotels, setLoadingHotels] = useState(true);
  const { bottom } = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const style = useMemo(() => contentContainerStyle(bottom), [bottom]);
  const [getHotels] = useLazyGetHotelsQuery();
  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const fetchHotels = async () => {
    setLoadingHotels(true);
    try {
      const res = await getHotels({}).unwrap();
      setHotels((res?.data?.data ?? []) as HotelItem[]);
    } catch (error) {
      setHotels([]);
    } finally {
      setLoadingHotels(false);
    }
  };

  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      fetchHotels();
    });
    return subscribe;
  }, []);

  return (
    <View style={[GeneralStyles.flex, styles.screenBackground]}>
      <ImageBackground
        source={images.accomodation_home}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <HomeHeader
          navigation={navigation}
          onPress={() => setIsModalVisible(true)}
          bag={false}
        />
        <View style={styles.textContainer}>
          <Text style={styles.accomodationText}>{labels.accomodation}</Text>
          <View style={styles.divider} />
          <Text style={styles.stayInStyles}>{labels.stayInComfort}</Text>
          <Text style={styles.liveInStyles}>{labels.liveInStyle}</Text>
          <Text style={styles.stayComfortStyles}>{labels.stayComfy}</Text>
        </View>
        <SearchWithFilters
          placeholder={labels.whatareYouLookingFor}
          navigation={navigation}
        />
      </ImageBackground>

      {loadingHotels && hotels.length === 0 ? (
        <ScrollView
          style={[GeneralStyles.flex, styles.screenBackground]}
          contentContainerStyle={[GeneralStyles.flexGrow, style?.contentContainerStyle]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.listContainer}>
            <ListWithIcon list={IconListArray} />
          </View>
          <View style={styles.gap}>
            <View style={styles.paddingleft}>
              <Text style={styles.yourNextGatewayText}>
                {labels.yourNexGateway}
              </Text>
            </View>
            <View style={styles.skeletonAccomodationWrap}>
              <SkeletonPlaceholder
                borderRadius={10}
                backgroundColor={colors.c_F3F3F3}
                highlightColor={colors.c_DDDDDD}
              >
                <View style={styles.skeletonAccomodationRow}>
                  {[1, 2, 3, 4].map((i) => (
                    <View key={i} style={styles.skeletonAccomodationCard}>
                      <View style={styles.skeletonAccomodationImage} />
                      <View style={styles.skeletonAccomodationTitle} />
                    </View>
                  ))}
                </View>
              </SkeletonPlaceholder>
            </View>
          </View>
          <View style={styles.gap}>
            <View style={GeneralStyles.paddingHorizontal}>
              <SectionHeader
                title={labels.hotelsForYou}
                onSeeAllPress={() => navigation.navigate('AllHotels')}
              />
            </View>
          </View>
          <View style={styles.skeletonRecommendedWrap}>
            <SkeletonPlaceholder
              borderRadius={10}
              backgroundColor={colors.c_F3F3F3}
              highlightColor={colors.c_DDDDDD}
            >
              {[1, 2, 3, 4].map((i) => (
                <View key={i} style={styles.skeletonRecommendedCard}>
                  <View style={styles.skeletonRecommendedImage} />
                  <View style={styles.skeletonRecommendedBody}>
                    <View style={styles.skeletonRecommendedTitle} />
                    <View style={styles.skeletonRecommendedDesc} />
                    <View style={styles.skeletonRecommendedMeta} />
                  </View>
                </View>
              ))}
            </SkeletonPlaceholder>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={hotels}
          keyExtractor={(item) => String(item?.id ?? Math.random())}
          contentContainerStyle={[
            GeneralStyles.flexGrow,
            style?.contentContainerStyle,
          ]}
          showsVerticalScrollIndicator={false}
          style={[GeneralStyles.flex, styles.screenBackground]}
          ListHeaderComponent={
            <View>
              <View style={styles.listContainer}>
                <ListWithIcon list={IconListArray} />
              </View>

              <View style={styles.gap}>
                <View style={styles.paddingleft}>
                  <Text style={styles.yourNextGatewayText}>
                    {labels.yourNexGateway}
                  </Text>
                </View>
                <AccomodationCard
                  list={hotels as any}
                  navigation={navigation}
                />
              </View>
              {/*<HomeCarousel data={CarouselData} /> */}

              <View style={styles.gap}>
                <View style={GeneralStyles.paddingHorizontal}>
                  <SectionHeader
                    title={labels.hotelsForYou}
                    onSeeAllPress={() => navigation.navigate('AllHotels')}
                  />
                </View>
              </View>
            </View>
          }
          renderItem={({ item }) => {
            const hotel = item as HotelItem;
            const imageSrc = hotel?.images?.[0] ? { uri: hotel.images[0] } : images.recommended_accomodation;
            const locationStr = hotel?.location
              ? [hotel.location.city, hotel.location.state, hotel.location.country].filter(Boolean).join(', ')
              : '—';
            return (
              <View style={styles.recommendedCardItem}>
                <RecommendedCard
                  image={imageSrc}
                  title={hotel?.name ?? 'Hotel'}
                  description={`$${Number(hotel?.rentPerDay ?? 0).toFixed(0)}/night`}
                  price={Number(hotel?.rentPerDay) ?? 0}
                  rating={4.5}
                  location={locationStr}
                  onPress={() => navigation.navigate('HotelDetails', { hotel })}
                />
              </View>
            );
          }}
        />
      )}

      <DrawerModal
        visible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
    </View>
  );
};

const contentContainerStyle = (bottom: number) =>
  StyleSheet.create({
    contentContainerStyle: {
      paddingBottom: bottom + 60,
    },
  });
export default Home;

const styles = StyleSheet.create({
  screenBackground: {
    backgroundColor: colors.white,
  },
  slide: {
    width: width,
    height: 200,
  },
  hotelForYou: {
    paddingHorizontal: 20,
    gap: 20,
    paddingBottom: 50,
  },
  recommendedCardItem: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  paddingleft: {
    paddingLeft: 20,
  },
  gap: {
    gap: 20,
  },
  imageBackground: {
    height: height * 0.4,
    paddingHorizontal: 20,
  },
  listContainer: {
    marginTop: 30,
  },
  accomodationText: {
    fontSize: 20,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
  divider: {
    height: 3,
    borderRadius: 100,
    width: 150,
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
  textContainer: { flex: 1, marginTop: 30 },

  carouselContainer: {},
  imageStyle: {
    borderRadius: 10,
    width: width * 0.9,
  },
  skeletonAccomodationWrap: {
    paddingLeft: 20,
    marginBottom: 8,
  },
  skeletonAccomodationRow: {
    flexDirection: 'row',
    gap: 15,
  },
  skeletonAccomodationCard: {
    width: 100,
  },
  skeletonAccomodationImage: {
    width: 100,
    height: 120,
    borderRadius: 10,
  },
  skeletonAccomodationTitle: {
    width: '80%',
    height: 12,
    borderRadius: 4,
    marginTop: 10,
  },
  skeletonRecommendedWrap: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  skeletonRecommendedCard: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  skeletonRecommendedImage: {
    width: 120,
    height: 150,
    borderRadius: 12,
  },
  skeletonRecommendedBody: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  skeletonRecommendedTitle: {
    width: '70%',
    height: 16,
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonRecommendedDesc: {
    width: '50%',
    height: 12,
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonRecommendedMeta: {
    width: '40%',
    height: 12,
    borderRadius: 4,
  },
});
