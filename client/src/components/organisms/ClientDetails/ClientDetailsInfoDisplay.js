import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { selectClientSelectedInfo } from '../../../state/clientDetails/clientDetailsSlice';

export default function ClientDetailsInfoDisplay() {
  const selectedInfo = useSelector(selectClientSelectedInfo);

  const infoOptions = [
    { label: 'Pets', value: 'pets' },
    { label: 'Notes', value: 'notes' },
    { label: 'Emergency Contacts', value: 'emergency_contacts' },
    { label: 'Vets', value: 'vets' },
    { label: 'Statistics', value: 'statistics' },
    { label: 'Documents', value: 'documents' },
  ];

  return (
    <View className="flex-1">
      {infoOptions.map((option) => {
        if (option.value === selectedInfo) {
          return (
            <View key={option.value} className="">
              <Text className="text-lg font-lexend-regular">
                Content for {option.label}
              </Text>
            </View>
          );
        }
        return null;
      })}
    </View>
  );
}
