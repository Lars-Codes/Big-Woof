import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';

// Import navigators
import BottomTabNavigator from './BottomTabNavigator';

// Import screens
import ClientDetailsScreen from '../screens/ClientDetailsScreen';
import AddClientScreen from '../screens/AddClientScreen';
import AddPetScreen from '../screens/AddPetScreen';
import AddAppointmentScreen from '../screens/AddAppointmentScreen';
import ServicesScreen from '../screens/ServicesScreen';
import AddServiceScreen from '../screens/AddServiceScreen';
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
        <Stack.Screen name="AddPet" component={AddPetScreen} />
        <Stack.Screen name="AddAppointment" component={AddAppointmentScreen} />
        <Stack.Screen name="Services" component={ServicesScreen} />
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