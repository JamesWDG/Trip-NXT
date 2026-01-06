import { Image, StyleSheet, Text, View } from 'react-native';
import React, { FC, useRef, useState } from 'react';
import IntroWrappers from '../../components/wrappers/IntroWrappers';
import AppIntroSlider from 'react-native-app-intro-slider';
import { ISlider, slides } from '../../constants/slider';
import { height, width } from '../../config/constants';
import GradientButton from '../../components/gradientButton/GradientButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import fonts from '../../config/fonts';
import colors from '../../config/colors';

const Intro: FC<{ navigation: any }> = ({ navigation }) => {
  const sliderRef = useRef<AppIntroSlider>(null);
  const { top } = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const _renderItem = ({ item }: { item: ISlider }) => {
    return (
      <View style={{ paddingTop: top }}>
        <Image source={item.image} style={styles.itemImage} />
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemText}>{item.text}</Text>
      </View>
    );
  };

  const _renderDoneButton = () => {
    return (
      <GradientButton
        title="Done"
        onPress={handleDone}
        fontFamily={fonts.semibold}
        otherStyles={[styles.buttonStyle, styles.nextOrDoneButtonStyle]}
      />
    );
  };
  const _renderSkipButton = () => {
    return (
      <GradientButton
        title="Skip"
        fontFamily={fonts.semibold}
        onPress={handleDone}
        otherStyles={[styles.buttonStyle, styles.nextOrSkipButtonStyle]}
      />
    );
  };
  const _renderNextButton = () => {
    return (
      <GradientButton
        title="Next"
        onPress={handleNext}
        fontFamily={fonts.semibold}
        otherStyles={[styles.buttonStyle, styles.nextOrDoneButtonStyle]}
      />
    );
  };
  const _renderPrevButton = () => {
    return (
      <GradientButton
        title="Back"
        onPress={handlePrev}
        fontFamily={fonts.semibold}
        otherStyles={[styles.buttonStyle, styles.nextOrSkipButtonStyle]}
      />
    );
  };

  const handleNext = () => {
    if (sliderRef.current && currentIndex < slides.length) {
      sliderRef.current.goToSlide(currentIndex + 1);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (sliderRef.current && currentIndex >= 1) {
      sliderRef.current.goToSlide(currentIndex - 1);
      setCurrentIndex(currentIndex - 1);
    }
  };
  const handleDone = () => {
    console.log('dfnersfdilueriud');
    navigation.replace('LoginAndSignup');
  };
  return (
    <View style={styles.container}>
      <IntroWrappers />
      <AppIntroSlider
        data={slides}
        ref={sliderRef}
        onDone={handleDone}
        onSkip={handleDone}
        showNextButton={true}
        showDoneButton={true}
        showPrevButton={true}
        showSkipButton={true}
        renderItem={_renderItem}
        renderDoneButton={_renderDoneButton}
        renderSkipButton={_renderSkipButton}
        renderNextButton={_renderNextButton}
        renderPrevButton={_renderPrevButton}
        dotStyle={styles.dotStyle}
        activeDotStyle={styles.activeDotStyle}
      />
    </View>
  );
};

export default Intro;

const styles = StyleSheet.create({
  paginationContainer: {},
  container: {
    // backgroundColor: 'red',
    flex: 1,
  },
  dotStyle: {
    backgroundColor: colors.c_666666,
    width: 20,
    height: 4,
    bottom: 100,
  },
  activeDotStyle: {
    backgroundColor: colors.primary,
    width: 20,
    height: 4,
    bottom: 100,
  },

  itemImage: {
    width: '100%',
    // height: '100%',
    maxHeight: height * 0.6,
    objectFit: 'contain',
  },
  itemTitle: {
    fontSize: 30,
    fontFamily: fonts.semibold,
    textAlign: 'center',
  },
  itemText: {
    fontSize: 16,
    fontFamily: fonts.normal,
    textAlign: 'center',
    maxWidth: width * 0.8,
    alignSelf: 'center',
    marginTop: 8,
  },
  buttonStyle: {
    width: width * 0.38,
    borderRadius: 100,
    bottom: 20,
  },
  nextOrDoneButtonStyle: {
    marginRight: 20,
  },
  nextOrSkipButtonStyle: {
    marginLeft: 12,
  },
});
