import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
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
      ) : (
        <SwipeListView
          data={clients}
          keyExtractor={(item) => item.client_id.toString()}
          renderItem={({ item }) => <ClientItem client={item} onLongPress />}
          onRefresh={handleRefresh}
          refreshing={loading}
          disableRightSwipe={true}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center min-h-80">
              <Text className="text-lg text-gray-500">
                No clients available.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
