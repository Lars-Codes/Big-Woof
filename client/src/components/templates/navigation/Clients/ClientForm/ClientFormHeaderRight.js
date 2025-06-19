import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export default function ClientFormHeaderRight({ navigation }) {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack();
      }}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text className="text-2xl font-hn-medium text-blue-500">
        Cancel
      </Text>
    </TouchableOpacity>
  );
}
