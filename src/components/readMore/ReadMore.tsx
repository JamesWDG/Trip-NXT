import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import fonts from '../../config/fonts';
import colors from '../../config/colors';
interface Params {
  readMoreText: string;
}

const isReadMore = (text: string) => {
  return text?.length > 200;
};
const ReadMore = ({ readMoreText }: Params) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <View>
      <Text style={styles.readMoreText}>
        {!expanded ? readMoreText.slice(0, 240) : readMoreText}
      </Text>
      <TouchableOpacity>
        <Text
          style={[styles.readMoreText, styles.readMoreTextStyle]}
          onPress={() => setExpanded(!expanded)}
        >
          {expanded ? 'Read Less' : 'Read More'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReadMore;

const styles = StyleSheet.create({
  readMoreText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
    lineHeight: 22,
  },
  readMoreTextStyle: {
    fontFamily: fonts.semibold,
  },
});
