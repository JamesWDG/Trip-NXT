import  { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './authStack/AuthStack';
import { navigationRef } from '../config/constants';
import BottomStack from './bottomStack/BottomStack';
export interface RootParamList {
  auth: undefined;
  [key: string]: undefined;
}

const RootNavigator = createNativeStackNavigator<RootParamList>();
const RootNavigation: FC = () => {
  return (
    <NavigationContainer ref={navigationRef} onReady={() => {}}>
      <RootNavigator.Navigator
        id="RootNavigator"
        screenOptions={{ headerShown: false }}
      >
          <RootNavigator.Screen name="auth" component={AuthStack} />
          <RootNavigator.Screen name="app" component={BottomStack} />
      </RootNavigator.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
