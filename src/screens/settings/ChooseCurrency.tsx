import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrency, Currency } from '../../redux/slices/settingsSlice';
import { RootState } from '../../redux/store';
import { ShowToast } from '../../config/constants';

const CURRENCY_OPTIONS: { value: Currency; label: string }[] = [
  { value: 'USD', label: 'US Dollar (USD)' },
  { value: 'NGN', label: 'Nigerian Naira (NGN)' },
];

const ChooseCurrency = () => {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const currentCurrency = useSelector((state: RootState) => state.settings?.currency ?? 'USD');

  const headerStyles = useMemo(() => makeHeaderStyles(top), [top]);

  const handleSelect = (value: Currency) => {
    dispatch(setCurrency(value));
    ShowToast('success', `Currency set to ${value === 'USD' ? 'US Dollar' : 'Nigerian Naira'}`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={headerStyles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeftIcon color={colors.white} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Currency</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.contentContainer}>
        {CURRENCY_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionRow,
              currentCurrency === option.value && styles.optionRowSelected,
            ]}
            onPress={() => handleSelect(option.value)}
            activeOpacity={0.7}
          >
            <Text style={styles.optionLabel}>{option.label}</Text>
            <View
              style={[
                styles.radioOuter,
                currentCurrency === option.value && styles.radioOuterSelected,
              ]}
            >
              {currentCurrency === option.value && (
                <View style={styles.radioInner} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ChooseCurrency;

const makeHeaderStyles = (top: number) =>
  StyleSheet.create({
    headerContainer: {
      paddingTop: top + 10,
      paddingBottom: 25,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      backgroundColor: colors.c_0162C0,
    },
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.c_0162C0,
  },
  backButton: {
    backgroundColor: colors.c_EE4026,
    padding: 8,
    borderRadius: 100,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.white,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 36,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -1,
    paddingHorizontal: 20,
    paddingTop: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: colors.c_F3F3F3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionRowSelected: {
    backgroundColor: 'rgba(244, 126, 32, 0.08)',
    borderColor: colors.c_F47E20,
  },
  optionLabel: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.black,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.c_CFD1D3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.c_F47E20,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.c_F47E20,
  },
});
