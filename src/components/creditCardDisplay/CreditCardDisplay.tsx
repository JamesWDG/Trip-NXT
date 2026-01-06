import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Plus } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface CreditCardDisplayProps {
  cardNumber: string;
  expiryDate: string;
  cardType?: string;
  onAddNew?: () => void;
}

const CreditCardDisplay = ({
  cardNumber,
  expiryDate,
  cardType = 'VISA',
  onAddNew,
}: CreditCardDisplayProps) => {
  // If onAddNew is provided, show "Add New Card" button
  if (onAddNew) {
    return (
      <TouchableOpacity style={styles.addNewButton} onPress={onAddNew}>
        <View style={styles.addNewIconContainer}>
          <Plus size={20} color={colors.black} />
        </View>
        <Text style={styles.addNewText}>Add New Card</Text>
      </TouchableOpacity>
    );
  }

  // Otherwise, show saved card
  return (
    <View style={styles.card}>
      <Text style={styles.cardType}>{cardType}</Text>
      <Text style={styles.cardNumber}>{cardNumber}</Text>
      <Text style={styles.expiryDate}>{expiryDate}</Text>
    </View>
  );
};

export default CreditCardDisplay;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.c_F3F3F3,
    borderRadius: 12,
    padding: 16,
  },
  cardType: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.c_0162C0,
    marginBottom: 8,
  },
  cardNumber: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 4,
  },
  expiryDate: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.c_DDDDDD,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    backgroundColor: colors.white,
  },
  addNewIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.c_F3F3F3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addNewText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.black,
  },
});
