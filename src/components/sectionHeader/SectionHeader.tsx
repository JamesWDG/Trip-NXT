import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface SectionHeaderProps {
  title: string;
  onSeeAllPress?: () => void;
  seeAllText?: string;
}

const SectionHeader = ({
  title,
  onSeeAllPress,
  seeAllText = 'See all',
}: SectionHeaderProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {onSeeAllPress && (
        <TouchableOpacity
          onPress={onSeeAllPress}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.seeAllText}>{seeAllText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SectionHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
});
