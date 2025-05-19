import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { fetchClientDetailsAction } from '../../sagas/clients/fetchClientDetails/action';
import { fetchClientProfilePictureAction } from '../../sagas/clients/fetchClientProfilePicture/action';

export default function ClientItem({ client }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleClientPress = (client) => {
    dispatch(fetchClientDetailsAction(client.client_id));
    dispatch(fetchClientProfilePictureAction(client.client_id));
    navigation.navigate('ClientDetails');
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
        <HugeiconsIcon icon={ArrowRight01Icon} size={32} />
      </View>
    </TouchableOpacity>
  );
}
