import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import {
  selectClientDetails,
  selectLoading,
} from '../../../state/clientDetails/clientDetailsSlice';
import ClientDetailsHeader from '../../organisms/ClientDetails/ClientDetailsHeader';
import ClientDetailsInfoDisplay from '../../organisms/ClientDetails/ClientDetailsInfoDisplay';
import ClientDetailsInfoSelector from '../../organisms/ClientDetails/ClientDetailsInfoSelector';

export default function ClientDetails() {
  const loading = useSelector(selectLoading);
  const client = useSelector(selectClientDetails);

  return (
    <View className="flex-1">
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#4A90E2"
          style={{ marginTop: 32 }}
        />
      ) : !client ? (
        <Text className="text-lg text-gray-500 mt-6">
          No client data available.
        </Text>
      ) : (
        <View className="flex-1 mt-28">
          <View className="flex-row h-22 px-4">
            <ClientDetailsHeader />
          </View>

          <View className="">
            <ClientDetailsInfoSelector />
          </View>

          <View className="flex-1 px-4">
            <ClientDetailsInfoDisplay />
          </View>
        </View>
      )}
    </View>
  );
}
