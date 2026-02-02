import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useEffect, useMemo, useState } from 'react';
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
import { RecommendedCard } from '../../dummyPage/DummyPage';
import DrawerModal from '../../../components/drawerModal/DrawerModal';
import { useNavigation } from '@react-navigation/native';
import GeneralStyles from '../../../utils/GeneralStyles';
import { useLazyGetHotelsQuery } from '../../../redux/services/hotel.service';

const Home = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { bottom } = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const style = useMemo(() => contentContainerStyle(bottom), [bottom]);
  const [getHotels] = useLazyGetHotelsQuery();
  const [hotels, setHotels] = useState([]);
  const fetchHotels = async () => {
    try {
      const res = await getHotels({}).unwrap();
      console.log('hotels response ===>', res);
      setHotels(res.data.data);
    } catch (error) {
      console.log('hotels error ===>', error);
    }
  }

  useEffect(() => {
    const subscribe = navigation.addListener('focus',()=>{
      fetchHotels();
    })
    return subscribe;
  },[])

  return (
    <View style={GeneralStyles.flex}>
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

      <FlatList
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        keyExtractor={(item) => String(item)}
        contentContainerStyle={[
          GeneralStyles.flexGrow,
          style?.contentContainerStyle,
        ]}
        showsVerticalScrollIndicator={false}
        style={GeneralStyles.flex}
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
                list={hotels}
                navigation={navigation}
              />
            </View>
            <HomeCarousel data={CarouselData} />

            <View style={styles.gap}>
              <View style={styles.paddingleft}>
                <Text style={styles.yourNextGatewayText}>
                  {labels.hotelsForYou}
                </Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.recommendedCardItem}>
            <RecommendedCard
              image={images.recommended_accomodation}
              title="Book Your Place"
              description={'$180/night'}
              price={100}
              rating={4.5}
              location={'Kingdom Tower, Brazil'}
              onPress={() => navigation.navigate('HotelDetails')}
            />
          </View>
        )}
      />

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
});
