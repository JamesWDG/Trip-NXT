import { StyleSheet, Text, View } from 'react-native';
import  { FC, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBars from '../../components/tabBars/TabBars';
import AppStack from '../appStack/AppStack';
import AccomodationStack from '../accomodationStack/AccomodationStack';
import CarStack from '../carStack/CarStack';
import FoodStack from '../foodStack/FoodStack';
import ProfileStack from '../profileStack/ProfileStack';
import EditProfile from '../../screens/editProfile/EditProfile';
import { useLazyGetUserQuery } from '../../redux/services/authService';
import { useDispatch } from 'react-redux';
import { saveCredentials } from '../../redux/slices/authSlice';

const Tab = createBottomTabNavigator();

// const HomeScreen = () => (
//   <View>
//     <Text>Home</Text>
//   </View>
// );

// const ProfileScreen = () => (
//   <View>
//     <Text>Profile</Text>
//   </View>
// );

const BottomStack: FC = () => {
  const [getUser, { data: userData, isLoading }] = useLazyGetUserQuery();
  const dispatch = useDispatch();

  const fetchUserDetails = async () => {
    try {
      const res = await getUser(undefined).unwrap();
      if (res?.data) {
        dispatch(saveCredentials(res.data));
      }
    } catch (error) {
      console.log('error while fetching user details ===>', error);
    }
  }

  useEffect(() => {
    fetchUserDetails();
  },[])

  return (
    <Tab.Navigator
      id="BottomTabNavigator"
      tabBar={props => <TabBars {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      backBehavior="history"
    >
      <Tab.Screen name="Accomodation" component={AccomodationStack} />
      <Tab.Screen name="Car" component={CarStack} />
      <Tab.Screen name="Food" component={FoodStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
      <Tab.Screen name="EditProfile" component={EditProfile} />
      <Tab.Screen name="Main" component={AppStack} />
    </Tab.Navigator>
  );
};

export default BottomStack;

const styles = StyleSheet.create({});
