import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from '../components/navigation/AppNavigator';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}