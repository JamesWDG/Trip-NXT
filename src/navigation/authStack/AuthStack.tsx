import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import Splash from '../../screens/splash/Splash';
import GetStarted from '../../screens/getStarted/GetStarted';
import Login from '../../screens/login/Login';
import Intro from '../../screens/intro/Intro';
import LoginAndSignup from '../../screens/loginAndSignup/LoginAndSignup';
import Signup from '../../screens/signup/Signup';
import OtpVerify from '../../screens/otpVerify/otpVerify';
import ForgotPassword from '../../screens/ForgotPassword/ForgotPassword';
import ResetPassword from '../../screens/Password/ResetPassword';

const AuthStackNavigator = createNativeStackNavigator();

const AuthStack: FC = () => {
  return (
    <AuthStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <AuthStackNavigator.Screen name="Splash" component={Splash} />
      <AuthStackNavigator.Screen name="GetStarted" component={GetStarted} />
      <AuthStackNavigator.Screen name="Intro" component={Intro} />
      <AuthStackNavigator.Screen name="Login" component={Login} />
      <AuthStackNavigator.Screen name="Signup" component={Signup} />
      <AuthStackNavigator.Screen name="OtpVerify" component={OtpVerify} />
      <AuthStackNavigator.Screen
        name="ForgotPassword"
        component={ForgotPassword}
      />
      <AuthStackNavigator.Screen
        name="ResetPassword"
        component={ResetPassword}
      />
      {/* <AuthStackNavigator.Screen
        name="DashboardTabs"
        component={DashboardTabs}
      /> */}
      <AuthStackNavigator.Screen
        name="LoginAndSignup"
        component={LoginAndSignup}
      />
    </AuthStackNavigator.Navigator>
  );
};

export default AuthStack;

const styles = StyleSheet.create({});
