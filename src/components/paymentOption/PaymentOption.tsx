import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface PaymentOptionProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

const PaymentOption = ({ label, selected, onSelect }: PaymentOptionProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.containerSelected]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default PaymentOption;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    padding: 12,
    backgroundColor: colors.c_F3F3F3,
    borderRadius: 100,
  },
  containerSelected: {
    // backgroundColor: colors.c_0162C0,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.c_F47E20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: colors.c_F47E20,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.c_F47E20,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
    // flex: 1,
  },
  labelSelected: {
    // color: colors.white,
  },
});
