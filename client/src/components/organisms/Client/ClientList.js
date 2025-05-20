import React from 'react';
import { View, FlatList, Text, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchClientsAction } from '../../../sagas/clients/fetchClients/action';
import { selectLoading } from '../../../state/clients/clientsSlice';
import ClientItem from '../../molecules/Client/ClientItem';

export default function ClientList({ clients }) {
  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();

  const handleRefresh = () => {
    dispatch(fetchClientsAction());
  };

  return (
    <View className="flex-1">
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#4A90E2"
          style={{ marginTop: 32 }}
        />
      ) : clients.length > 0 ? (
        <FlatList
          data={clients}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <ClientItem client={item} />}
          onRefresh={handleRefresh}
          refreshing={loading}
        />
      ) : (
        <Text className="text-lg text-gray-500">No clients available.</Text>
      )}
    </View>
  );
}
