import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import DummyPage from '../../screens/dummyPage/DummyPage';
import Home from '../../screens/Ride/home/Home';
import SaveAddress from '../../screens/Ride/saveAddress/SaveAddress';
import RideHailingSearch from '../../screens/Ride/rideHailingSearch/RideHailingSearch';
import EnableLocation from '../../screens/Ride/enableLocation/EnableLocation';
import ChooseDestination from '../../screens/Ride/chooseDestination/ChooseDestination';
import ChooseYourCar from '../../screens/Ride/chooseYourCar/ChooseYourCar';
import FindingYourRide from '../../screens/Ride/findingYourRide/FindingYourRide';
import DriverDetails from '../../screens/Ride/driverDetails/DriverDetails';
import PlaceInMinutes from '../../screens/Ride/placeInMinutes/PlaceInMinutes';
import DriverArrived from '../../screens/Ride/driverArrived/DriverArrived';
import JourneyStarts from '../../screens/Ride/journeyStarts/JourneyStarts';
import YouArrived from '../../screens/Ride/youArrived/YouArrived';
import TripDetailsForRide from '../../screens/Ride/tripDetails/TripDetails';
import MyBookings from '../../screens/Ride/myBookings/MyBookings';
import Notifications from '../../screens/notifications/Notifications';
import BookARide from '../../screens/Ride/bookARide/BookARide';
import FindARider from '../../screens/Ride/findARider/FindARider';
// import MyBookings from '../../screens/Ride/myBookings/MyBookings';
const CarStackNavigator = createNativeStackNavigator();

const CarStack: FC = () => {
  return (
    <CarStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <CarStackNavigator.Screen name="RideHome" component={Home} />
      <CarStackNavigator.Screen name="BookARide" component={BookARide} />
      <CarStackNavigator.Screen name="FindARider" component={FindARider} />
      <CarStackNavigator.Screen name="MyBookings" component={MyBookings} />
      <CarStackNavigator.Screen
        name="TripDetailsForRide"
        component={TripDetailsForRide}
      />
      {/* <CarStackNavigator.Screen name="MyBookings" component={MyBookings} /> */}
      <CarStackNavigator.Screen name="YouArrived" component={YouArrived} />
      <CarStackNavigator.Screen
        name="JourneyStarts"
        component={JourneyStarts}
      />
      <CarStackNavigator.Screen
        name="DriverArrived"
        component={DriverArrived}
      />
      <CarStackNavigator.Screen
        name="PlaceInMinutes"
        component={PlaceInMinutes}
      />
      <CarStackNavigator.Screen
        name="DriverDetails"
        component={DriverDetails}
      />
      <CarStackNavigator.Screen
        name="FindingYourRide"
        component={FindingYourRide}
      />
      <CarStackNavigator.Screen
        name="ChooseYourCar"
        component={ChooseYourCar}
      />
      <CarStackNavigator.Screen
        name="ChooseDestination"
        component={ChooseDestination}
      />
      <CarStackNavigator.Screen
        name="EnableLocation"
        component={EnableLocation}
      />
      <CarStackNavigator.Screen
        name="RideHailingSearch"
        component={RideHailingSearch}
      />
      <CarStackNavigator.Screen
        name="Notifications"
        component={Notifications}
      />
      <CarStackNavigator.Screen name="SaveAddress" component={SaveAddress} />
      <CarStackNavigator.Screen name="Dummy" component={DummyPage} />
    </CarStackNavigator.Navigator>
  );
};

export default CarStack;

const styles = StyleSheet.create({});
