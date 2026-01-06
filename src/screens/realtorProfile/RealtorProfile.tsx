import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import WrapperContainer from '../../components/wrapperContainer/WrapperContainer';
import IntroCard from '../../components/introCard/IntroCard';
import images from '../../config/images';
import GeneralStyles from '../../utils/GeneralStyles';
import {
  RealtorProfileCard,
  RealtorProfileCardType,
} from '../../constants/Accomodation';
import CalenderWithDescription from '../../components/calenderWithDescription/CalenderWithDescription';
import ReadMore from '../../components/readMore/ReadMore';
import Divider from '../../components/divider/Divider';
import colors from '../../config/colors';
import ReviewCard from '../../components/reviewCard/ReviewCard';
import { width } from '../../config/constants';
import fonts from '../../config/fonts';
import GradientButtonForAccomodation from '../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import { RecommendedCard } from '../dummyPage/DummyPage';

const RealtorProfile = () => {
  return (
    <WrapperContainer title="Realtor Profile">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          GeneralStyles.flexGrow,
          GeneralStyles.paddingBottom,
        ]}
        style={GeneralStyles.flex}
      >
        <View
          style={[GeneralStyles.paddingHorizontal, styles.introCardContainer]}
        >
          <IntroCard
            name={'John Doe'}
            rating={4.5}
            reviews={100}
            yearsHosting={10}
            image={images.avatar}
            description={
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries."
            }
            designation={'CEO, Company Name'}
          />

          <FlatList
            data={RealtorProfileCard}
            contentContainerStyle={styles.flatListContentContainer}
            renderItem={({ item }: { item: RealtorProfileCardType }) => (
              <CalenderWithDescription description={item.title} />
            )}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            keyExtractor={(item, index) => index.toString()}
          />

          <View style={[GeneralStyles.paddingVertical]}>
            <ReadMore readMoreText="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries." />
          </View>

          <Divider height={1} color={colors.c_CFD1D3} width={'100%'} />
        </View>
        <View>
          <Text style={[GeneralStyles.paddingHorizontal, styles.reviewTitle]}>
            James Henry Reviews
          </Text>

          <FlatList
            data={[1, 2, 2, 2, 2, 2]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <ReviewCard
                name={'James Henry'}
                rating={4.5}
                time={'1 Day ago'}
                image={images.avatar}
                otherStyles={{ width: width * 0.75 }}
                description={
                  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries."
                }
              />
            )}
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={styles.flatListContentContainer2}
            showsVerticalScrollIndicator={false}
            // scrollEnabled={false}
          />
        </View>

        <GradientButtonForAccomodation
          title="Show all 20 reviews"
          onPress={() => {}}
          fontSize={16}
          fontFamily={fonts.semibold}
          otherStyles={{
            width: width * 0.75,
            alignSelf: 'center',
            marginTop: 30,
          }}
        />

        <View
          style={[GeneralStyles.paddingHorizontal, GeneralStyles.marginTop]}
        ></View>
        <View>
          <Text style={[GeneralStyles.paddingHorizontal, styles.reviewTitle]}>
            James Henry Reviews
          </Text>

          <FlatList
            showsVerticalScrollIndicator={false}
            horizontal={true}
            data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            renderItem={({ item }) => (
              <RecommendedCard
                image={images.recommended_accomodation}
                title="Book Your Place jasbgd uywsduyw"
                description={'$180/night'}
                price={100}
                rating={4.5}
                location={'Kingdom Tower, Brazil'}
                onPress={() => {}}
                otherStyles={{ width: width * 0.86 }}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.hotelForYou}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={styles.reportMainContainer}>
          <Divider height={0.5} color={colors.gray} width={'100%'} />
          <View style={styles.reportContainer}>
            <Image source={images.flag} style={styles.flag} />
            <Text>Report James Henry</Text>
          </View>
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

export default RealtorProfile;

const styles = StyleSheet.create({
  introCardContainer: {
    marginTop: 30,
  },
  flag: {
    width: 15,
    height: 15,
  },
  reviewTitle: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    marginTop: 30,
    marginBottom: 20,
  },
  flatListContentContainer: {
    marginTop: 30,
  },
  flatListContentContainer2: {
    gap: 20,
    marginLeft: 20,
  },
  reviewCardContainer: {},
  hotelForYou: {
    paddingHorizontal: 20,
    gap: 20,
    paddingBottom: 50,
  },
  reportContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reportMainContainer: {
    paddingHorizontal: 20,
    gap: 15,
  },
});
