import './global.css';

import { UserListIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import ClientsNavigator from './src/components/templates/Clients/ClientsNavigator';
import { initAction } from './src/sagas/init/action';
import store from './src/state/store';
import './src/sagas/rootSaga';
const Tab = createBottomTabNavigator();

function AppContent({ onLayout }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initAction());
  }, []);

  return (
    <View style={{ flex: 1 }} onLayout={onLayout}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerTitle: 'App Name',
            headerTitleStyle: {
              fontFamily: 'lexend-regular',
              fontSize: 28,
            },
            tabBarLabelStyle: {
              fontFamily: 'lexend-bold',
              fontSize: 14,
            },
            tabBarActiveTintColor: '#007Aff', // Active icon and label color
            tabBarInactiveTintColor: '#888', // Inactive icon and label color
          }}
        >
          <Tab.Screen
            name="Clients"
            component={ClientsNavigator}
            options={{
              tabBarIcon: ({ color }) => (
                <HugeiconsIcon icon={UserListIcon} size={32} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'lexend-black': require('./src/assets/fonts/LexendDeca-Black.ttf'),
    'lexend-bold': require('./src/assets/fonts/LexendDeca-Bold.ttf'),
    'lexend-extrabold': require('./src/assets/fonts/LexendDeca-ExtraBold.ttf'),
    'lexend-extralight': require('./src/assets/fonts/LexendDeca-ExtraLight.ttf'),
    'lexend-light': require('./src/assets/fonts/LexendDeca-Light.ttf'),
    'lexend-medium': require('./src/assets/fonts/LexendDeca-Medium.ttf'),
    'lexend-regular': require('./src/assets/fonts/LexendDeca-Regular.ttf'),
    'lexend-semibold': require('./src/assets/fonts/LexendDeca-SemiBold.ttf'),
    'lexend-thin': require('./src/assets/fonts/LexendDeca-Thin.ttf'),
  });

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <AppContent onLayout={onLayoutRootView} />
    </Provider>
  );
}
