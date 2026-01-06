import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { StarIcon } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
interface Params {
  ratings: number;
}
const RatingsBadge = ({ ratings }: Params) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.ratingsText}>{ratings}</Text>
      <StarIcon fill={colors.black} size={18} />
    </TouchableOpacity>
  );
};

export default RatingsBadge;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.black,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  ratingsText: {
    fontSize: 20,
    fontFamily: fonts.bold,
  },
});
