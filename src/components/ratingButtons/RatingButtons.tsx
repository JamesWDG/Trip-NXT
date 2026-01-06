import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { Star } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface RatingButtonsProps {
  onRatingSelect?: (rating: number) => void;
  initialRating?: number;
}

const RatingButtons = ({
  onRatingSelect,
  initialRating,
}: RatingButtonsProps) => {
  const [selectedRating, setSelectedRating] = useState<number | undefined>(
    initialRating,
  );

  const handleRatingPress = (rating: number) => {
    setSelectedRating(rating);
    onRatingSelect?.(rating);
  };

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map(rating => (
        <TouchableOpacity
          key={rating}
          style={[
            styles.button,
            selectedRating === rating && styles.buttonSelected,
          ]}
          onPress={() => handleRatingPress(rating)}
        >
          <Text
            style={[
              styles.buttonText,
              selectedRating === rating && styles.buttonTextSelected,
            ]}
          >
            {rating} ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RatingButtons;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  button: {
    flex: 1,
    height: 40,
    borderRadius: 100,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.c_F3F3F3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSelected: {
    backgroundColor: colors.c_F47E20,
    borderColor: colors.c_F47E20,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.black,
  },
  buttonTextSelected: {
    color: colors.white,
  },
});
