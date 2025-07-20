import React from 'react';
import { Text, TouchableOpacity, Alert } from 'react-native';

export default function FormHeaderRight({ navigation }) {
  const handleCancel = () => {
    Alert.alert('Cancel Form', 'Are you sure you want to close the form?', [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  return (
    <TouchableOpacity
      onPress={handleCancel}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      activeOpacity={0.7}
    >
      <Text className="text-2xl font-hn-medium text-blue-500">Cancel</Text>
    </TouchableOpacity>
  );
}
