import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChevronLeft, CircleEllipsis } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { selectClientDetails } from '../../../../state/clientDetails/clientDetailsSlice';
import ClientHeader from '../../../organisms/Client/ClientHeader';
import ClientDetails from '../../../pages/Clients/ClientDetails';
import Clients from '../../../pages/Clients/Clients';

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
              <ChevronLeft size={32} color="#000" />
            </TouchableOpacity>
          ) : null,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: 'white',
        },
        headerTitleAlign: 'left',
        headerBackTitleVisible: false,
      })}
    >
      <Stack.Screen
        name="ClientsList"
        component={Clients}
        options={() => ({
          header: () => (
            <View className="flex-row items-end bg-white px-4 py-2 h-28">
              <View className="flex-1 mr-1">
                <ClientHeader />
              </View>
            </View>
          ),
          headerTitle: '',
          gestureEnabled: false,
        })}
      />
      <Stack.Screen
        name="ClientDetails"
        component={ClientDetails}
        options={({ navigation }) => ({
          headerTitle: () => (
            <Text className="text-4xl font-hn-bold">Client Details</Text>
          ),
          headerRight: () => (
            <TouchableOpacity
              className="mr-2"
              // onPress={() => native drop down menu; for right now, just open the bottom sheet wuth the client form
              onPress={() =>
                navigation.navigate('ClientForm', { client: client })
              }
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <CircleEllipsis size={32} color="#000" />
            </TouchableOpacity>
          ),
          gestureEnabled: false,
        })}
      />
    </Stack.Navigator>
  );
}
