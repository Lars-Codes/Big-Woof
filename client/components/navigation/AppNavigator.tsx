import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';

// Import navigators
import BottomTabNavigator from './BottomTabNavigator';

// Import screens
import AddAppointmentScreen from '../screens/AddAppointmentScreen';
import AddClientScreen from '../screens/Clients/AddClientScreen';
import AddPetScreen from '../screens/AddPetScreen';
import AddServiceScreen from '../screens/AddServiceScreen';
import ClientDetailsScreen from '../screens/Clients/ClientDetailsScreen';
import EditClientScreen from '../screens/Clients/EditClientScreen';
import { RootStackParamList } from '../../types/navigation';

// Import Header
import Header from './Header';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <View style={styles.container}>
      <Header />
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: 'white' },
        }}
      >
        <Stack.Screen name="Main" component={BottomTabNavigator} />
        <Stack.Screen name="ClientDetails" component={ClientDetailsScreen} />
        <Stack.Screen name="AddClient" component={AddClientScreen} />
        <Stack.Screen name="EditClient" component={EditClientScreen} />
        <Stack.Screen name="AddPet" component={AddPetScreen} />
        <Stack.Screen name="AddAppointment" component={AddAppointmentScreen} />
        <Stack.Screen name="AddService" component={AddServiceScreen} />
      </Stack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppNavigator;