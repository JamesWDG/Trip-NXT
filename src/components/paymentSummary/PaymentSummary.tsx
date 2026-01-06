import { StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { CreditCard } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import Divider from '../divider/Divider';

interface PaymentSummaryItem {
  label: string;
  amount: number;
  isDiscount?: boolean;
}

interface PaymentSummaryProps {
  items: PaymentSummaryItem[];
  total: number;
  onPromoCodeChange?: (code: string) => void;
  promoCode?: string;
}

const PaymentSummary = ({
  items,
  total,
  onPromoCodeChange,
  promoCode: initialPromoCode = '',
}: PaymentSummaryProps) => {
  const [promoCode, setPromoCode] = useState(initialPromoCode);

  const handlePromoCodeChange = (text: string) => {
    setPromoCode(text);
    onPromoCodeChange?.(text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Payment Summary</Text>

      {/* Promo Code Input */}
      <View style={styles.promoCodeContainer}>
        <View style={styles.promoCodeInputContainer}>
          <CreditCard size={20} color={colors.c_666666} />
          <TextInput
            style={styles.promoCodeInput}
            placeholder="Enter your promo code"
            placeholderTextColor={colors.c_666666}
            value={promoCode}
            onChangeText={handlePromoCodeChange}
          />
        </View>
      </View>

      {/* Summary Items */}
      <View style={styles.summaryContainer}>
        {items.map((item, index) => (
          <>
            <View key={index} style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{item.label}</Text>
              <Text
                style={[
                  styles.summaryAmount,
                  item.isDiscount && styles.discountAmount,
                ]}
              >
                {item.isDiscount ? '-' : ''}${item.amount.toFixed(2)}
              </Text>
            </View>

            {index !== items.length - 1 ? (
              <Divider height={0.5} color={colors.lightGray} width="100%" />
            ) : (
              <View style={styles.dashedLine} />
            )}
            {/* <Divider height={0.5} color={colors.lightGray} width="100%" /> */}
          </>
        ))}

        {/* Dashed Line */}

        {/* Total */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};

export default PaymentSummary;

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.semibold,
    color: colors.black,
    marginBottom: 16,
  },
  promoCodeContainer: {
    marginBottom: 6,
  },
  promoCodeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 100,
    paddingHorizontal: 16,
    // paddingVertical: 12,
    height: 48,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  promoCodeInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
  },
  summaryContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
  },
  summaryAmount: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
  },
  discountAmount: {
    color: colors.c_EE4026,
  },
  dashedLine: {
    borderTopWidth: 0.5,
    borderColor: colors.lightGray,
    borderStyle: 'dashed',
    marginVertical: 6,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: fonts.semibold,
    color: colors.black,
  },
  totalAmount: {
    fontSize: 18,
    fontFamily: fonts.semibold,
    color: colors.black,
  },
});
