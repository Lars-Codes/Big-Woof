import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Blur from 'expo-blur';
import { ChevronLeft, CircleEllipsis } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ClientListHeaderLeft from './ClientsList/ClientListHeaderLeft';
import ClientListHeaderRight from './ClientsList/ClientListHeaderRight.js';
import ClientDetails from '../../../pages/Clients/ClientDetails';
import Clients from '../../../pages/Clients/Clients';
import ClientForm from '../../../templates/forms/Client/ClientForm';
import HeaderTitle from '../helpers/HeaderTitle.js';

const Stack = createNativeStackNavigator();

export default function ClientsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: true,
        animation: 'slide_from_right',
        headerTransparent: true,
        headerShadowVisible: false,
        headerTitleAlign: 'left',
        headerBackTitleVisible: false,
        headerBackground: () => (
          <Blur.BlurView
            intensity={80}
            tint="light"
            className="flex-1"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
            }}
          />
        ),
      })}
    >
      <Stack.Screen
        name="ClientsList"
        component={Clients}
        options={({ navigation }) => ({
          headerTitle: () => <HeaderTitle title="Clients" />,
          headerLeft: () => (
            <View className="">
              <ClientListHeaderLeft />
            </View>
          ),
          headerRight: () => <ClientListHeaderRight navigation={navigation} />,
          gestureEnabled: false,
        })}
      />
      <Stack.Screen
        name="ClientDetails"
        component={ClientDetails}
        options={({ navigation }) => ({
          headerTitle: () => <HeaderTitle title="Client Details" />,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ChevronLeft size={32} color="#000" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              className="mr-2"
              onPress={() => navigation.navigate('ClientForm')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <CircleEllipsis size={32} color="#000" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="ClientForm"
        component={ClientForm}
        options={({ navigation }) => ({
          presentation: 'modal',
          headerTitle: () => (
            <Text className="text-2xl font-hn-bold">New Client</Text>
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text className="text-blue-500 text-lg">Cancel</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text className="text-blue-500 text-lg font-semibold">Done</Text>
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)', // Less transparent for modal
          },
        })}
      />
    </Stack.Navigator>
  );
}
