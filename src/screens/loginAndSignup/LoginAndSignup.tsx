import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import WrapperWithVideo from '../../components/wrappers/WrapperWithVideo';
import images from '../../config/images';
import GradientButton from '../../components/gradientButton/GradientButton';
import fonts from '../../config/fonts';
import Button from '../../components/button/Button';
import colors from '../../config/colors';
import { width } from '../../config/constants';
import ButtonWithIcon from '../../components/buttonWithIcon/ButtonWithIcon';
import labels from '../../config/labels';

const LoginAndSignup = ({ navigation }: { navigation: any }) => {
  const onLoginPress = () => {
    navigation.navigate('Login');
  };
  const onSignupPress = () => {
    navigation.navigate('Signup');
  };
  return (
    <WrapperWithVideo>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        bounces={false}
      >
        <Image source={images.splash} style={styles.image} />
        <View style={styles.buttonContainer}>
          <GradientButton
            title={labels.login}
            onPress={onLoginPress}
            fontFamily={fonts.bold}
            fontSize={18}
          />
          <Button
            title={labels.signup}
            onPress={onSignupPress}
            fontFamily={fonts.bold}
            fontSize={18}
          />
        </View>

        {/* Or Component */}
        <View style={styles.orContainer}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>{labels.or}</Text>
          <View style={styles.orLine} />
        </View>

        {/* Google Signup Button */}
        <View style={styles.continueWithGoogleContainer}>
          <ButtonWithIcon
            title={labels.continueWithGoogle}
            type='google'
          />
          <ButtonWithIcon
            type='apple'
            height={35}
            width={35}
            imageSrc={images.apple}
            title={labels.continueWithApple}
          />
        </View>
      </ScrollView>
    </WrapperWithVideo>
  );
};

export default LoginAndSignup;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  buttonContainer: {
    width: "100%",
    gap: 20,
    marginTop: 100,
    paddingHorizontal: 4,
  },
  image: {
    height: 140,
    width: 227,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 40,
    width: width * 0.9,
  },
  orLine: {
    height: 1,
    flex: 1,
    backgroundColor: colors.white,
  },
  orText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.normal,
  },
  continueWithGoogleContainer: {
    gap: 20,
    width: "100%",
    marginVertical: 28,
  },
});
