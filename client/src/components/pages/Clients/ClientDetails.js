import React from 'react';
import { View, Text, ActivityIndicator, Image } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useSelector } from 'react-redux';
import {
  selectClientDetails,
  selectClientProfilePicture,
  selectLoading,
} from '../../../state/clientDetails/clientDetailsSlice';
import ClientDetailsInfoDisplay from '../../organisms/ClientDetails/ClientDetailsInfoDisplay';
import ClientDetailsInfoSelector from '../../organisms/ClientDetails/ClientDetailsInfoSelector';

export default function ClientDetails() {
  const loading = useSelector(selectLoading);
  const client = useSelector(selectClientDetails);
  const clientProfilePicture = useSelector(selectClientProfilePicture);

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
        <View className="flex-1">
          <View className="flex-row h-[25%] border-2 border-blue-500 p-4">
            <View className="w-[35%] border-2 border-blue-500 justify-center items-center">
              {clientProfilePicture ? (
                <SvgXml xml={clientProfilePicture} width={100} height={100} />
              ) : (
                <Image
                  source={{ uri: 'https://picsum.photos/200' }}
                  className="w-[100px] h-[100px] rounded-full"
                />
              )}
            </View>
            <View className="w-[65%] border-2 border-blue-500 p-4">
              <Text className="text-4xl text-gray-800 font-hn-medium mb-1">
                {client.client_data.fname} {client.client_data.lname}
              </Text>
              <Text className="text-xl text-gray-800 font-hn-medium">
                {client.client_contact.email}
              </Text>
              <Text className="text-xl text-gray-800 font-hn-medium">
                {client.client_contact.primary_phone}
              </Text>
              <Text className="text-xl text-gray-800 font-hn-medium">
                {client.client_data.num_pets} pets
              </Text>
            </View>
          </View>

          <View className="flex-row h-[15%] border-2 border-blue-500">
            <ClientDetailsInfoSelector />
          </View>

          <View className="flex-row h-[60%] border-2 border-blue-500 p-4">
            <ClientDetailsInfoDisplay />
          </View>
        </View>
      )}
    </View>
  );
}
