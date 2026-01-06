import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Calendar } from 'lucide-react-native';
import fonts from '../../config/fonts';
import colors from '../../config/colors';
import Divider from '../divider/Divider';
interface Params {
  description: string;
}
const CalenderWithDescription = ({
  description = 'I spend too much time: watching reels',
}: Params) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Calendar size={24} color={colors.black} />
        <Text style={styles.description} numberOfLines={1}>
          {description}
        </Text>
      </View>
      <Divider height={0.5} color={colors.gray} width={'100%'} />
    </View>
  );
};

export default CalenderWithDescription;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    fontFamily: fonts.normal,
    color: colors.black,
  },
  mainContainer: {
    paddingVertical: 10,
  },
});
