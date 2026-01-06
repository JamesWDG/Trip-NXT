import {
  FlatList,
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useMemo, useRef, useState } from 'react';
import { IconList } from '../../constants/Accomodation';
import fonts from '../../config/fonts';
import colors from '../../config/colors';
import { FoodCard } from '../../constants/Food';

const ListWithIcon = ({
  list,
  height = 25,
  width = 25,
}: {
  list: IconList[];
  height?: number;
  width?: number;
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const iconStyle = useMemo(() => iconStyles(height, width), [height, width]);
  const handleSelect = (index: number) => {
    setSelectedIndex(index);

    // Scroll to selected item
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5, // item center mein aa jayega
    });
  };

  const _renderItem = ({
    item,
    index,
  }: {
    item: IconList | FoodCard;
    index: number;
  }) => {
    const isSelected = index === selectedIndex;
    return (
      <TouchableOpacity
        style={{
          alignItems: 'center',
          width: 100,
          borderBottomWidth: 3,
          borderColor: isSelected ? colors.black : colors.transparent,
          paddingBottom: 10,
        }}
        onPress={() => handleSelect(index)}
      >
        <Image
          source={item.icon as ImageSourcePropType}
          style={iconStyle.iconStyle}
          resizeMode="contain"
        />
        <Text style={styles.title}>{item.title}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <FlatList
      data={list}
      ref={flatListRef}
      renderItem={_renderItem}
      keyExtractor={(item, index) => index.toString()}
      horizontal
      contentContainerStyle={styles.contentContainerStyle}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default ListWithIcon;

const iconStyles = (height: number, width: number) =>
  StyleSheet.create({
    iconStyle: { height: height, width: height },
  });
const styles = StyleSheet.create({
  title: {
    fontSize: 12,
    fontFamily: fonts.normal,
    marginTop: 10,
  },
  contentContainerStyle: { paddingLeft: 20 },
});
