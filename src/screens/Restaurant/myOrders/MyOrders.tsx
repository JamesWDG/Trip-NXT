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

const MyOrders = () => {
  const navigation = useNavigation<any>();
  // console.log('navigation', navigation.getState());
  return (
    <WrapperContainer title="My Orders" navigation={navigation}>
      {/* <View style={styles.mainContainer}>
        <AccomodationTabButtons data={['Hotels', 'Foods', 'Rides']} />
        <SearchWithFilters placeholder={labels.whatareYouLookingFor} />
      </View> */}
      {/* <View> */}
      <FlatList
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        renderItem={({ item }) => (
          <FoodItemCard
            image={images.newly_opened}
            title="Pretzel Chicken Noodle Soup - Regular"
            description="Noodles"
            price={100}
            rating={4.5}
            reviewCount={10}
            onPress={() => navigation.navigate('FoodDetails')}
          />
        )}
        //   keyExtractor={item => item.id}
        horizontal={false}
        contentContainerStyle={styles.hotelForYou}
        showsHorizontalScrollIndicator={false}
      />
      {/* </View> */}
    </WrapperContainer>
  );
};

export default MyOrders;

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
    marginTop: 20,
    gap: 20,
    paddingBottom: 50,
  },
  mainContainer: {
    paddingTop: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
    // backgroundColor: 'red',
  },
});
