import React from 'react';
import { View, Text } from 'react-native';

const SectionHeader = ({ title, icon }) => (
  <View className="bg-gray-100 px-4 py-2 border-b border-gray-200">
    <View className="flex-row items-center">
      <Text className="text-lg font-semibold text-gray-700">{title}</Text>
      {icon && <View className="ml-2">{icon}</View>}
    </View>
  </View>
);

export default SectionHeader;
