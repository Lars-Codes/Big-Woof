import React from 'react';
import { View } from 'react-native';
import ListFooter from '../../molecules/List/ListFooter';
import ClientList from '../../organisms/Client/ClientList';

export default function Clients() {
  return (
    <View className="flex-1 bg-white">
      <ClientList />
      <View className="absolute bottom-0 left-0 right-0">
        <ListFooter />
      </View>
    </View>
  );
}
