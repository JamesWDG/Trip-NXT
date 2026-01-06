import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Calendar } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { width } from '../../config/constants';

interface DateInputProps {
  placeholder: string;
  value?: string;
  onPress: () => void;
  otherStyles?: any;
}

const DateInput = ({
  placeholder,
  value,
  onPress,
  otherStyles,
}: DateInputProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, otherStyles]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, value && styles.textWithValue]}>
        {value || placeholder}
      </Text>
      <Calendar size={20} color={colors.c_666666} />
    </TouchableOpacity>
  );
};

export default DateInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width * 0.9,
    height: 50,
    borderRadius: 100,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.c_F3F3F3,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  text: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    flex: 1,
  },
  textWithValue: {
    color: colors.black,
  },
});
