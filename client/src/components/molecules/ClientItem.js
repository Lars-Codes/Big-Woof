import { StarIcon, StarOffIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { setSelectedClient } from '../../state/clients/clientsSlice';

export default function ClientItem({ client }) {
  const handleClientPress = (client) => {
    setSelectedClient(client);
    // Navigate to the client details page
  };

  return (
    <TouchableOpacity
      onPress={() => {
        handleClientPress(client);
      }}
    >
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
        <Text className="text-3xl text-gray-800 font-lexend-regular">
          {client.fname} {client.lname}
        </Text>
        <HugeiconsIcon
          icon={client.favorite ? StarIcon : StarOffIcon}
          size={32}
          className="text-gold"
        />
      </View>
    </TouchableOpacity>
  );
}
