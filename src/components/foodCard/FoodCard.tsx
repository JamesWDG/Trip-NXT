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
        style={styles.container}
        onPress={() => navigation.navigate('FoodRestaurantInformation', {
          id: item?.id,
          name: item?.name,
          logo: item?.logo,
          description: item?.description,
          banner: item?.banner,
          createdAt: item?.createdAt,
          deliveryRadius: item?.deliveryRadius,
        })}
        activeOpacity={0.8}
      >
        <FastImage
          source={{ uri: item?.logo } as any}
          style={styles.image}
          resizeMode="cover"
        />
        <Text numberOfLines={1} style={styles.title}>
          {item?.name}
        </Text>
        <View>
          <Text numberOfLines={1} style={styles.time}>
            {item?.description}
          </Text>
        </View>
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
  container: {
    width: 100,
    // padding: 10,
    borderRadius: 10,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
  },
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
    // textAlign: 'center',
    fontSize: 10,
    fontFamily: fonts.medium,
    color: colors.black,
    letterSpacing: 1.1,
  },
  time: {
    fontSize: 10,
    fontFamily: fonts.normal,
  },
});
