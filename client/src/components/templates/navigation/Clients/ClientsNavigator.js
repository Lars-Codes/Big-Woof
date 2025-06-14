import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Blur from 'expo-blur';
import React from 'react';
import { useSelector } from 'react-redux';
import ClientFormHeaderRight from './ClientForm/ClientFormHeaderRight.js';
import ClientListHeaderLeft from './ClientsList/ClientListHeaderLeft';
import ClientListHeaderRight from './ClientsList/ClientListHeaderRight.js';
import ClientDetails from '../../../pages/Clients/ClientDetails';
import Clients from '../../../pages/Clients/Clients';
import ClientForm from '../../../templates/forms/Client/ClientForm';
import HeaderTitle from '../helpers/HeaderTitle.js';
import ClientDetailsHeaderLeft from './ClientDetails/ClientDetailsHeaderLeft.js';
import ClientDetailsHeaderRight from './ClientDetails/ClientDetailsHeaderRight.js';
import { selectClientDetails } from '../../../../state/clientDetails/clientDetailsSlice.js';

const Stack = createNativeStackNavigator();

export default function ClientsNavigator() {
  const clientDetails = useSelector(selectClientDetails);

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
          headerLeft: () => <ClientListHeaderLeft />,
          headerRight: () => <ClientListHeaderRight navigation={navigation} />,
          gestureEnabled: false,
        })}
      />
      <Stack.Screen
        name="ClientDetails"
        component={ClientDetails}
        options={({ navigation }) => ({
          headerTitle: () => <HeaderTitle title="Client Details" />,
          headerLeft: () => <ClientDetailsHeaderLeft navigation={navigation} />,
          headerRight: () => (
            <ClientDetailsHeaderRight navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="ClientForm"
        component={ClientForm}
        options={({ navigation }) => ({
          presentation: 'modal',
          gestureEnabled: false,
          headerTitle: () => (
            <HeaderTitle title={clientDetails ? 'Edit Client' : 'Add Client'} />
          ),
          headerRight: () => <ClientFormHeaderRight navigation={navigation} />,
          headerStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          },
        })}
      />
    </Stack.Navigator>
  );
}
