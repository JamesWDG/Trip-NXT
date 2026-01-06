import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Plus } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface PriceItem {
  label: string;
  amount: number;
}

interface PriceDetailsCardProps {
  items: PriceItem[];
  total: number;
  onAddMore?: () => void;
}

const PriceDetailsCard = ({
  items,
  total,
  onAddMore,
}: PriceDetailsCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {items.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.amount}>${item.amount}</Text>
          </View>
        ))}
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>${total}</Text>
        </View>
      </View>
      {onAddMore && (
        <TouchableOpacity style={styles.addMoreButton} onPress={onAddMore}>
          <View style={styles.addMoreIconContainer}>
            <Plus size={16} color={colors.white} />
          </View>
          <Text style={styles.addMoreText}>Add More Guest Details</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PriceDetailsCard;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.c_F3F3F3,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  amount: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.c_F3F3F3,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  totalAmount: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
  },
  addMoreIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.c_F47E20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMoreText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_F47E20,
  },
});
