import { ScrollView, StyleSheet, Text, View, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import FastImage from 'react-native-fast-image';
import images from '../../../config/images';
import { width } from '../../../config/constants';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import fonts from '../../../config/fonts';

const ThankYouScreen = ({ navigation }: { navigation?: any }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Fade in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleReturnHome = () => {
    // Reset navigation stack and go to Home
    navigation?.reset({
      index: 0,
      routes: [{ name: 'AccomodationHome' }],
    });
  };

  return (
    <WrapperContainer title=" " onBackPress={()=>handleReturnHome()} >
      <ScrollView contentContainerStyle={styles.container}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <FastImage
            source={images.thank_you_logo}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        <Text style={styles.title}>Thank You For Booking</Text>
        <Text style={styles.description}>
          You successfully created your booking. To print your booking.
        </Text>

        <View style={styles.buttonContainer}>
          <GradientButtonForAccomodation
            title="Return Home"
            onPress={handleReturnHome}
            fontSize={16}
            fontFamily={fonts.bold}
          />
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

export default ThankYouScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.bold,
    textAlign: 'center',
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  logo: {
    height: 200,
    width: width * 0.6,
  },
  buttonContainer: {
    width: width * 0.9,
    marginTop: 20,
  },
});
