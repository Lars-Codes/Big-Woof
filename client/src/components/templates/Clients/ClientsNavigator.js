import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ClientDetails from '../../pages/Clients/ClientDetails';
import Clients from '../../pages/Clients/Clients';

const Stack = createNativeStackNavigator();

export default function ClientsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="ClientsList" component={Clients} />
      <Stack.Screen name="ClientDetails" component={ClientDetails} />
    </Stack.Navigator>
  );
}
