import {
  ArrowLeft01Icon,
  MoreHorizontalIcon,
  PlusSignIcon,
  Delete03Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { selectClientDetails } from '../../../../state/clientDetails/clientDetailsSlice';
import ClientDetails from '../../../pages/Clients/ClientDetails';
import Clients from '../../../pages/Clients/Clients';
import ClientForm from '../../forms/Client/ClientForm';

const Stack = createNativeStackNavigator();

export default function ClientsNavigator() {
  const client = useSelector(selectClientDetails);

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        animation: 'slide_from_right',
        headerLeft: () =>
          navigation.canGoBack() ? (
            <TouchableOpacity
              className="mr-2"
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={32} color="#000" />
            </TouchableOpacity>
          ) : null,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: 'white',
        },
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontFamily: 'lexend-bold',
          fontSize: 20,
          color: '#000',
        },
        headerBackTitleVisible: false,
      })}
    >
      <Stack.Screen
        name="ClientsList"
        component={Clients}
        options={({ navigation }) => ({
          headerTitle: () => (
            <Text className="text-3xl font-lexend-semibold">Clients</Text>
          ),
          headerLeft: () => (
            <TouchableOpacity
              className="mr-2"
              // onPress={() => create new client; navigate to client form with an empty client object
              onPress={() => navigation.navigate('ClientForm', { client: {} })}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <HugeiconsIcon icon={PlusSignIcon} size={32} color="#000" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              className="mr-2"
              // onPress={() => delete selected clients mode
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <HugeiconsIcon icon={Delete03Icon} size={32} color="#000" />
            </TouchableOpacity>
          ),
          gestureEnabled: false, // Prevent swipe back
        })}
      />
      <Stack.Screen
        name="ClientDetails"
        component={ClientDetails}
        options={({ navigation }) => ({
          headerTitle: () => (
            <Text className="text-3xl font-lexend-semibold">
              Client Details
            </Text>
          ),
          headerRight: () => (
            <TouchableOpacity
              className="mr-2"
              // onPress={() => native drop down menu; for right now, just navigate to client form with the selected client
              onPress={() =>
                navigation.navigate('ClientForm', { client: client })
              }
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <HugeiconsIcon icon={MoreHorizontalIcon} size={32} color="#000" />
            </TouchableOpacity>
          ),
          gestureEnabled: false, // Prevent swipe back
        })}
      />
      <Stack.Screen
        name="ClientForm"
        component={ClientForm}
        options={() => ({
          headerTitle: () => (
            <Text className="text-3xl font-lexend-semibold">Client Form</Text>
          ),
          gestureEnabled: false,
        })}
      />
    </Stack.Navigator>
  );
}
