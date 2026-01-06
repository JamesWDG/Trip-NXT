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

const MyBookings = () => {
  const navigation = useNavigation<any>();
  return (
    <WrapperContainer title="My Bookings">
      <View style={styles.mainContainer}>
        <AccomodationTabButtons data={['Hotels', 'Foods']} />
        {/* <SearchWithFilters placeholder={labels.whatareYouLookingFor} /> */}
      </View>
      {/* <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          {
            // paddingTop: 30,
          }
        }
      >
        <View> */}
      <FlatList
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        renderItem={({ item }) => (
          <RecommendedCard
            image={images.recommended_accomodation}
            title="Book Your Place"
            description={'$180/night'}
            price={100}
            rating={4.5}
            location={'Kingdom Tower, Brazil'}
            onPress={() => navigation.navigate('HotelDetails')}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        horizontal={false}
        contentContainerStyle={styles.hotelForYou}
        showsHorizontalScrollIndicator={false}
      />
      {/* </View> */}
      {/* // </ScrollView> */}
    </WrapperContainer>
  );
};

export default MyBookings;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.c_0162C0,
    flex: 1,
  },
  mainContainer: {
    paddingTop: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
    // backgroundColor: 'red',
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
