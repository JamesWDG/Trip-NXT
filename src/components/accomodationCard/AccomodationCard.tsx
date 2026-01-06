import {
  FlatList,
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
interface Params {
  list: AccomodationCardType[];
  navigation?: any;
}
const AccomodationCard = ({ list, navigation }: Params) => {
  const _renderItem = ({
    item,
    index,
  }: {
    item: AccomodationCardType;
    index: number;
  }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation?.navigate('HotelDetails')}
        activeOpacity={0.8}
      >
        <FastImage
          source={item?.image}
          style={styles.image}
          resizeMode="cover"
        />
        <Text numberOfLines={1} style={styles.title}>
          {item?.title}
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

export default AccomodationCard;

const styles = StyleSheet.create({
  contentContainerStyle: {
    gap: 15,
    paddingLeft: 20,
  },
  image: {
    height: 120,
    width: 100,
    borderRadius: 10,
  },
  title: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.black,
    letterSpacing: 1.1,
  },
});
