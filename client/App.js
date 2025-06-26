import './global.css';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { List } from 'lucide-react-native';
import React, { useEffect, useCallback } from 'react';
import { View, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useDispatch } from 'react-redux';
import ListNavigator from './src/components/templates/navigation/Clients/ListNavigator';
import { initAction } from './src/sagas/init/action';
import store from './src/state/store';
import './src/sagas/rootSaga';
import { preloadBreedImages } from './src/utils/pets/petBreedImages';
const Tab = createBottomTabNavigator();

function AppContent({ onLayout }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Preload breed images
        await preloadBreedImages();
        dispatch(initAction());
      } catch (error) {
        console.error('Error during app initialization:', error);
        dispatch(initAction());
      }
    };

    initializeApp();
  }, []);

  return (
    <View style={{ flex: 1 }} onLayout={onLayout}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarLabelStyle: {
              fontFamily: 'hn-bold',
              fontSize: 14,
            },
            tabBarActiveTintColor: '#007Aff', // Active icon and label color
            tabBarInactiveTintColor: '#888', // Inactive icon and label color
          }}
        >
          <Tab.Screen
            name="Lists"
            component={ListNavigator}
            options={{
              tabBarIcon: ({ color }) => <List size={32} color={color} />,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'hn-black': require('./src/assets/fonts/HelveticaNeueBlack.otf'),
    'hn-bold': require('./src/assets/fonts/HelveticaNeueBold.otf'),
    'hn-heavy': require('./src/assets/fonts/HelveticaNeueHeavy.otf'),
    'hn-light': require('./src/assets/fonts/HelveticaNeueLight.otf'),
    'hn-medium': require('./src/assets/fonts/HelveticaNeueMedium.otf'),
    'hn-thin': require('./src/assets/fonts/HelveticaNeueThin.otf'),
    'hn-ultralight': require('./src/assets/fonts/HelveticaNeueUltraLight.otf'),
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
      <ActionSheetProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          <AppContent onLayout={onLayoutRootView} />
        </GestureHandlerRootView>
      </ActionSheetProvider>
    </Provider>
  );
}
