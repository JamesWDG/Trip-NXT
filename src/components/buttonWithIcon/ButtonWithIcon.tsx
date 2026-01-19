import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import React, { FC, useEffect } from 'react';
import images from '../../config/images';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import Loader from '../AppLoader/Loader';
import { ShowToast } from '../../config/constants';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useSocialLoginMutation } from '../../redux/services/authService';
import { appleAuth } from '@invertase/react-native-apple-authentication';

interface Params {
  imageSrc?: string;
  title: string;
  onPress?: () => void;
  height?: number;
  width?: number;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  fontSize?: number;
  fontFamily?: string;
  loader?: boolean;
  type?: 'google' | 'apple';
}

const ButtonWithIcon: FC<Params> = ({
  imageSrc = images.google,
  title,
  onPress,
  height = 20,
  width = 20,
  backgroundColor = colors.transparent,
  borderColor = colors.white,
  textColor = colors.white,
  fontSize = 16,
  fontFamily = fonts.normal,
  loader = false,
  type = 'google',
}) => {
  const imageStyle = imageStyles(height, width);
  const containerStyles = styles(backgroundColor, borderColor);
  const textStyle = textStyles(textColor, fontSize, fontFamily);
  const [socialLogin, { isLoading }] = useSocialLoginMutation();

  useEffect(() => {
    if (type === 'google') {
      GoogleSignin.configure();
    }
  }, []);

  const handleSocialLogin = async (name: string, email: string, socialLoginProvider: 'google' | 'apple', socialLoginId: string, profilePicture?: string) => {
    const result = await socialLogin({
      email: email,
      socialLoginProvider: socialLoginProvider,
      socialLoginId: socialLoginId,
      name: name,
      profilePicture: profilePicture || '',
    }).unwrap();
    console.log('result', result);
    if (result.success) {
      ShowToast('success', result.message);
    } else {
      ShowToast('error', result.message);
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Get the users ID token
      const signInResult = await GoogleSignin.signIn();
      console.log('signInResult', signInResult);
      await handleSocialLogin(signInResult?.data?.user.name || '', signInResult?.data?.user.email || '', 'google', signInResult?.data?.user.id || '', signInResult?.data?.user.photo || '');
    } catch (error) {
      console.log('Google Sign In error', error);
      ShowToast('error', 'Google Sign In failed');
    }
  }

  const handleAppleSignIn = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        // Note: it appears putting FULL_NAME first is important, see issue #293
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });
      console.log('appleAuthRequestResponse', appleAuthRequestResponse);
      const name = appleAuthRequestResponse?.fullName?.givenName || appleAuthRequestResponse?.fullName?.familyName || '';
      await handleSocialLogin(name, appleAuthRequestResponse.email || '', 'apple', appleAuthRequestResponse.user || '');
    } catch (error) {
      console.log('Apple Sign In error', error);
      ShowToast('error', 'Apple Sign In failed');
    }
  }

  return (
    <TouchableOpacity onPress={type === 'google' ? handleGoogleSignIn : handleAppleSignIn || onPress} style={containerStyles.container}>
      <Image source={imageSrc} style={imageStyle.image} />
      {(isLoading || loader) ? <Loader /> : <Text style={textStyle.text}>{title}</Text>}
    </TouchableOpacity>
  );
};

export default ButtonWithIcon;

const textStyles = (color: string, fontSize: number, fontFamily: string) =>
  StyleSheet.create({
    text: {
      color: color,
      fontSize: fontSize,
      fontFamily: fontFamily,
    },
  });
const imageStyles = (height: number, width: number) =>
  StyleSheet.create({
    image: {
      width: height,
      height: width,
    },
  });
const styles = (backgroundColor: string, borderColor: string) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      backgroundColor,
      borderWidth: 1,
      borderColor: borderColor,
      height: 48,
      width: '100%',
      borderRadius: 100,
    },
  });
