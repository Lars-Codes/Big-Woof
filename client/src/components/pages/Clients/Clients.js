import React from 'react';
import { View } from 'react-native';
import ClientListFooter from '../../molecules/Client/ClientListFooter';
import ClientList from '../../organisms/Client/ClientList';

export default function Clients() {
  return (
    <View className="flex-1 bg-white">
      <ClientList />
      <View className="absolute bottom-0 left-0 right-0">
        <ClientListFooter />
      </View>
    </View>
  );
}
