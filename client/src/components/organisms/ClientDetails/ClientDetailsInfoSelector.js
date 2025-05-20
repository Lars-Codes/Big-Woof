import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectClientSelectedInfo,
  setClientSelectedInfo,
} from '../../../state/clientDetails/clientDetailsSlice';

export default function ClientDetailsInfoSelector() {
  const dispatch = useDispatch();
  const selectedOption = useSelector(selectClientSelectedInfo);
  const flatListRef = useRef(null);

  const infoOptions = [
    { label: 'Pets', value: 'pets' },
    { label: 'Notes', value: 'notes' },
    { label: 'Emergency Contacts', value: 'emergency_contacts' },
    { label: 'Vets', value: 'vets' },
    { label: 'Statistics', value: 'statistics' },
    { label: 'Documents', value: 'documents' },
  ];

  return (
    <View className="flex-row w-full justify-around items-center">
      <FlatList
        ref={flatListRef}
        data={infoOptions}
        horizontal
        keyExtractor={(item) => item.value}
        renderItem={({ item, index }) => {
          const isSelected = item.value === selectedOption;
          return (
            <TouchableOpacity
              className="rounded-lg p-2 m-2"
              onPress={() => {
                dispatch(setClientSelectedInfo(item.value));
                if (flatListRef.current) {
                  flatListRef.current.scrollToIndex({
                    index,
                    animated: true,
                    viewPosition: 0.5,
                  });
                }
              }}
            >
              <Text className="text-4xl font-lexend-regular mx-2">
                {item.label}
              </Text>
              {isSelected && <View className="h-1 bg-blue-500 mt-1 rounded" />}
            </TouchableOpacity>
          );
        }}
        showsHorizontalScrollIndicator={false}
        // Handle potential errors with scrollToIndex
        onScrollToIndexFailed={(info) => {
          const wait = new Promise((resolve) => setTimeout(resolve, 500));
          wait.then(() => {
            if (flatListRef.current) {
              flatListRef.current.scrollToIndex({
                index: info.index,
                animated: true,
              });
            }
          });
        }}
      />
    </View>
  );
}
