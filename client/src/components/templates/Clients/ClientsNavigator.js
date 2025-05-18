import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Clients from '../../pages/Clients/Clients';

const Stack = createNativeStackNavigator();

export default function ClientsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ClientsList" component={Clients} />
    </Stack.Navigator>
  );
}
