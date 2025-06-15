import { Dog } from 'lucide-react-native';
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { selectClientPets } from '../../../state/clientDetails/clientDetailsSlice';

export default function ClientPetsList() {
  const pets = useSelector(selectClientPets);

  if (!pets || pets.length === 0) {
    return (
      <View className="flex-1 justify-center items-center mb-20">
        <Dog size={48} color="#D1D5DB" />
        <Text className="text-lg font-hn-medium mt-4 text-center">No Pets</Text>
        <Text className="text-sm font-hn-regular text-gray-800 mt-2 text-center">
          Add pets to see them here
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {pets.map((pet, index) => (
        <View
          key={pet.pet_id}
          className={`bg-white rounded-lg p-4 ${
            index === 0 ? 'mt-4' : 'mt-2'
          } ${index === pets.length - 1 ? 'mb-4' : 'mb-2'}`}
        >
          <Text className="text-2xl font-hn-bold mb-2">{pet.name}</Text>
          <View className="flex-row items-center gap-1">
            <Text className="text-lg font-hn-medium">Breed:</Text>
            <Text className="text-lg font-hn-regular">{pet.breed}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Text className="text-lg font-hn-medium ">Age:</Text>
            <Text className="text-lg font-hn-regular">{pet.age} years old</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
