import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import colors from '../../../config/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryHeader from '../../../components/primaryHeader/PrimaryHeader';
import SearchWithFilters from '../../../components/searchWithFilters/SearchWithFilters';
import labels from '../../../config/labels';
import { RecommendedCard } from '../../dummyPage/DummyPage';
import images from '../../../config/images';
import AccomodationTabButtons from '../../../components/accomodationTabButtons/AccomodationTabButtons';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import { useNavigation } from '@react-navigation/native';
import FoodItemCard from '../../../components/foodItemCard/FoodItemCard';

const Wishlists = () => {
  const navigation = useNavigation<any>();
  return (
    <WrapperContainer title="Wishlists" navigation={navigation}>
      <View
        style={{
          paddingTop: 30,
          paddingHorizontal: 20,
          marginBottom: 20,
          // backgroundColor: 'red',
        }}
      >
        <AccomodationTabButtons data={['Hotels', 'Foods']} />
        {/* <SearchWithFilters placeholder={labels.whatareYouLookingFor} /> */}
      </View>

      <View>
        <FlatList
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          renderItem={({ item }) => (
            <FoodItemCard
              image={images.recommended_accomodation}
              title="Book Your Place"
              description={'Lorem Ipsum is simply dummy text'}
              price={100}
              rating={4.5}
              reviewCount={10}
              onPress={() => navigation.navigate('HotelDetails')}
            />
          )}
          //   keyExtractor={item => item.id}
          horizontal={false}
          contentContainerStyle={styles.hotelForYou}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </WrapperContainer>
  );
};

export default Wishlists;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.c_0162C0,
    flex: 1,
  },
  scrollViewContent: {
    backgroundColor: colors.white,
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // paddingHorizontal: 20,
  },
  hotelForYou: {
    paddingHorizontal: 20,
    gap: 20,
    paddingBottom: 50,
  },
});
