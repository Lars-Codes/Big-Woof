import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import navigators
import BottomTabNavigator from './BottomTabNavigator';

// Import screens
import ClientDetailsScreen from '../screens/ClientDetailsScreen';
import AddClientScreen from '../screens/AddClientScreen';
import AddPetScreen from '../screens/AddPetScreen';
import AddAppointmentScreen from '../screens/AddAppointmentScreen';
import ServicesScreen from '../screens/ServicesScreen';

// Define screen parameters type
export type RootStackParamList = {
  Main: undefined;
  ClientDetails: { id: string };
  AddClient: undefined;
  AddPet: { clientId: string };
  AddAppointment: { clientId?: string, petId?: string };
  Services: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// Remove the NavigationContainer wrapper
const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'white' },
      }}
    >
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen name="ClientDetails" component={ClientDetailsScreen}  />
      <Stack.Screen name="AddClient" component={AddClientScreen} />
      <Stack.Screen name="AddPet" component={AddPetScreen} />
      <Stack.Screen name="AddAppointment" component={AddAppointmentScreen} />
      <Stack.Screen name="Services" component={ServicesScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;