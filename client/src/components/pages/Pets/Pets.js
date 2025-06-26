import React from 'react';
import { View } from 'react-native';
import ListFooter from '../../molecules/List/ListFooter';
import PetList from '../../organisms/Pet/PetList';

export default function Pets() {
  return (
    <View className="flex-1 bg-white">
      <PetList />
      <View className="absolute bottom-0 left-0 right-0">
        <ListFooter />
      </View>
    </View>
  );
}
