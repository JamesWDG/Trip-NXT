import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Minus, Plus } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface CounterProps {
  label: string;
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  min?: number;
  max?: number;
}

const Counter = ({
  label,
  value,
  onDecrease,
  onIncrease,
  min = 0,
  max = 10,
}: CounterProps) => {
  const isDecreaseDisabled = value <= min;
  const isIncreaseDisabled = value >= max;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.counterContainer}>
        <TouchableOpacity
          style={[styles.button, isDecreaseDisabled && styles.buttonDisabled]}
          onPress={onDecrease}
          disabled={isDecreaseDisabled}
        >
          <Minus
            size={12}
            color={isDecreaseDisabled ? colors.c_CFD1D3 : colors.white}
          />
        </TouchableOpacity>
        <Text style={styles.value}>{value}</Text>
        <TouchableOpacity
          style={[styles.button, isIncreaseDisabled && styles.buttonDisabled]}
          onPress={onIncrease}
          disabled={isIncreaseDisabled}
        >
          <Plus
            size={12}
            color={isIncreaseDisabled ? colors.c_CFD1D3 : colors.white}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Counter;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.black,
    flex: 1,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  button: {
    width: 24,
    height: 24,
    borderRadius: 18,
    backgroundColor: colors.c_F47E20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#707070',
    // Shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16, // 29 in hex ≈ 0.16 opacity
    shadowRadius: 6,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: colors.c_F3F3F3,
    borderColor: '#707070',
  },
  value: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.black,
    minWidth: 30,
    textAlign: 'center',
  },
});
