import  { FC, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './authStack/AuthStack';
import { navigationRef } from '../config/constants';
import BottomStack from './bottomStack/BottomStack';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
export interface RootParamList {
  auth: undefined;
  [key: string]: undefined;
}

const RootNavigator = createNativeStackNavigator<RootParamList>();
const RootNavigation: FC = () => {
  const { currency } = useSelector((state: RootState) => state.settings);

  useEffect(() => {
    console.log('currency', currency);
  }, [currency]);
  
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
