import React from 'react';
import { View, FlatList, Text } from 'react-native';
import ClientItem from '../molecules/ClientItem';

export default function ClientList({ clients }) {
  return (
    <View className="flex-1">
      {clients.length > 0 ? (
        <FlatList
          data={clients}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <ClientItem client={item} />}
        />
      ) : (
        <Text className="text-lg text-gray-500">No clients available.</Text>
      )}
    </View>
  );
}
