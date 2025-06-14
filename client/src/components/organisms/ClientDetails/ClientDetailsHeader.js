import { Pin } from 'lucide-react-native';
import React from 'react';
import { View, Text, Image } from 'react-native';
import { useSelector } from 'react-redux';
import {
  selectClientDetails,
  selectClientFavorite,
  selectClientProfilePicture,
} from '../../../state/clientDetails/clientDetailsSlice';

export default function ClientDetailsHeader() {
  const client = useSelector(selectClientDetails);
  const clientProfilePicture = useSelector(selectClientProfilePicture);
  const clientFavorite = useSelector(selectClientFavorite);

  if (!client) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-500 font-hn-medium">
          No client data available.
        </Text>
      </View>
    );
  }

  const renderProfilePicture = () => {
    const imageUri = clientProfilePicture?.startsWith('data:')
      ? clientProfilePicture
      : `data:image/jpeg;base64,${clientProfilePicture}`;

    return (
      <Image
        source={{ uri: imageUri }}
        className="w-[100px] h-[100px] rounded-full"
      />
    );
  };

  return (
    <View className="flex-row flex-1">
      <View className="w-[35%] justify-center items-center">
        {renderProfilePicture()}
      </View>
      <View className="w-[65%] p-4 justify-center">
        <View className="flex-row items-center mb-2">
          <Text className="text-3xl text-gray-800 font-hn-bold">
            {client.client_data.fname} {client.client_data.lname}
          </Text>
          {clientFavorite && (
            <View className="ml-2">
              <Pin size={16} color="#000" fill="#999" />
            </View>
          )}
        </View>

        <View className="flex-row h-5 mb-1">
          <Text className="text-base font-hn-regular text-gray-800">
            {client.client_contact.primary_phone}
          </Text>
        </View>

        <View className="flex-row h-5 mb-1">
          {client.client_contact.email && (
            <Text
              className="text-base font-hn-regular text-gray-800 flex-1"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {client.client_contact.email}
            </Text>
          )}
        </View>

        <View className="flex-row h-5 mb-1">
          {client.client_contact.street_address && (
            <Text
              className="text-base font-hn-regular text-gray-800 flex-1"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {client.client_contact.street_address},{' '}
              {client.client_contact.city}, {client.client_contact.state}{' '}
              {client.client_contact.zip}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
