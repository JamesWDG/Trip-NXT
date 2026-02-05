import { StyleSheet, Text, View, PanResponder, Dimensions } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface PriceRangeSliderProps {
  minPrice?: number;
  maxPrice?: number;
  onRangeChange?: (min: number, max: number) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDER_WIDTH = SCREEN_WIDTH - 80; // Account for padding

const PriceRangeSlider = ({
  minPrice = 50,
  maxPrice = 1200,
  onRangeChange,
}: PriceRangeSliderProps) => {
  const [minValue, setMinValue] = useState(100);
  const [maxValue, setMaxValue] = useState(300);

  // Calculate positions as percentages
  const minPositionPercent =
    ((minValue - minPrice) / (maxPrice - minPrice)) * 100;
  const maxPositionPercent =
    ((maxValue - minPrice) / (maxPrice - minPrice)) * 100;

  // Convert pixel position to value
  const pixelToValue = (pixel: number) => {
    const percentage = (pixel / SLIDER_WIDTH) * 100;
    const value = minPrice + (percentage / 100) * (maxPrice - minPrice);
    return Math.max(minPrice, Math.min(maxPrice, Math.round(value)));
  };

  // Convert value to pixel position
  const valueToPixel = (value: number) => {
    const percentage = ((value - minPrice) / (maxPrice - minPrice)) * 100;
    return (percentage / 100) * SLIDER_WIDTH;
  };

  const minHandleRef = useRef<View>(null);
  const maxHandleRef = useRef<View>(null);

  useEffect(() => {
    onRangeChange?.(minValue, maxValue);
  }, []);

  const minPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {},
      onPanResponderMove: (evt, gestureState) => {
        const newPixel = valueToPixel(minValue) + gestureState.dx;
        const newValue = pixelToValue(newPixel);
        if (newValue < maxValue - 10 && newValue >= minPrice) {
          setMinValue(newValue);
          if (onRangeChange) {
            onRangeChange(newValue, maxValue);
          }
        }
      },
    }),
  ).current;

  const maxPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {},
      onPanResponderMove: (evt, gestureState) => {
        const newPixel = valueToPixel(maxValue) + gestureState.dx;
        const newValue = pixelToValue(newPixel);
        if (newValue > minValue + 10 && newValue <= maxPrice) {
          setMaxValue(newValue);
          if (onRangeChange) {
            onRangeChange(minValue, newValue);
          }
        }
      },
    }),
  ).current;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Price Range Per Day</Text>
        <Text style={styles.rangeText}>
          ${minValue} - ${maxValue}
        </Text>
      </View>

      <View style={styles.sliderContainer}>
        {/* Slider Track */}
        <View style={styles.trackContainer}>
          {/* Background Track */}
          <View style={styles.track} />

          {/* Selected Range Track */}
          <View
            style={[
              styles.trackSelected,
              {
                left: `${minPositionPercent}%`,
                width: `${maxPositionPercent - minPositionPercent}%`,
              },
            ]}
          />

          {/* Min Handle */}
          <View
            ref={minHandleRef}
            style={[styles.handle, { left: `${minPositionPercent}%` }]}
            {...minPanResponder.panHandlers}
          >
            <View style={styles.handleCircle} />
          </View>

          {/* Max Handle */}
          <View
            ref={maxHandleRef}
            style={[styles.handle, { left: `${maxPositionPercent}%` }]}
            {...maxPanResponder.panHandlers}
          >
            <View style={styles.handleCircle} />
          </View>
        </View>

        {/* Value labels */}
        <View style={styles.valuesContainer}>
          <Text style={styles.valueText}>${minPrice}</Text>
          <View style={styles.selectedValues}>
            <Text style={styles.selectedValueText}>${minValue}</Text>
            <Text style={styles.selectedValueText}>${maxValue}</Text>
          </View>
          <Text style={styles.valueText}>${maxPrice}</Text>
        </View>
      </View>
    </View>
  );
};

export default PriceRangeSlider;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  rangeText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  sliderContainer: {
    marginTop: 10,
  },
  trackContainer: {
    position: 'relative',
    height: 40,
    justifyContent: 'center',
    marginVertical: 20,
  },
  track: {
    position: 'absolute',
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.c_F3F3F3,
  },
  trackSelected: {
    position: 'absolute',
    height: 6,
    backgroundColor: colors.c_F47E20,
    borderRadius: 3,
  },
  handle: {
    position: 'absolute',
    width: 24,
    height: 24,
    marginLeft: -12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  handleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.c_F47E20,
    // iOS shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Android shadow
    elevation: 4,
  },
  valuesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 10,
  },
  valueText: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  selectedValues: {
    flexDirection: 'row',
    gap: 40,
  },
  selectedValueText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.c_F47E20,
  },
});
