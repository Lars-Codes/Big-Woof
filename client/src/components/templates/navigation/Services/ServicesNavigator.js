import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Blur from 'expo-blur';
import React from 'react';
import ServiceDetails from '../../../pages/Services/ServiceDetails.js';
import Services from '../../../pages/Services/Services.js';
import DetailsHeaderLeft from '../Clients/Details/DetailsHeaderLeft.js';
import HeaderTitle from '../helpers/HeaderTitle.js';

const Stack = createNativeStackNavigator();

export default function Navigator() {
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
        name="MainServices"
        component={Services}
        options={{
          headerTitle: () => <HeaderTitle title="Services" />,
          //   headerLeft: () => <HeaderSelector />,
          //   headerRight: () => <HeaderRight />,
        }}
      />
      <Stack.Screen
        name="ServiceDetails"
        component={ServiceDetails}
        options={({ navigation }) => ({
          headerTitle: () => <HeaderTitle title="Service Details" />,
          headerLeft: () => <DetailsHeaderLeft navigation={navigation} />,
          //   headerRight: () => <HeaderRight />,
        })}
      />
    </Stack.Navigator>
  );
}
