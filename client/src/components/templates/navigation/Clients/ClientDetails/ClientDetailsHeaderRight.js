import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export default function ClientDetailsHeaderRight({ navigation }) {
  return (
    <TouchableOpacity
      className="mr-2"
      onPress={() => navigation.navigate('ClientForm')}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text className="text-2xl font-hn-medium text-blue-500 underline">
        Edit
      </Text>
    </TouchableOpacity>
  );
}
