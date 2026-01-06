import {
  FlatList,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { AccomodationCard as AccomodationCardType } from '../../constants/Accomodation';
import FastImage from 'react-native-fast-image';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { FoodListCardType } from '../../constants/Food';
interface Params {
  list: FoodListCardType[];
  navigation?: any;
}
const FoodCard = ({ list = [], navigation }: Params) => {
  const _renderItem = ({
    item,
    index,
  }: {
    item: FoodListCardType;
    index: number;
  }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('FoodRestaurantInformation')}
        activeOpacity={0.8}
      >
        <FastImage
          source={item?.image as ImageSourcePropType}
          style={styles.image}
          resizeMode="cover"
        />
        <Text numberOfLines={1} style={styles.title}>
          {item?.title}
        </Text>
        <Text numberOfLines={1} style={styles.time}>
          {item?.time}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <FlatList
      data={list}
      contentContainerStyle={styles.contentContainerStyle}
      renderItem={_renderItem}
      keyExtractor={(item, index) => index.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default FoodCard;

const styles = StyleSheet.create({
  contentContainerStyle: {
    gap: 15,
    paddingLeft: 20,
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 10,
    alignSelf: 'center',
  },
  title: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.black,
    letterSpacing: 1.1,
  },
  time: {
    fontSize: 13,
    fontFamily: fonts.normal,
  },
});
