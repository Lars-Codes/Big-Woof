import { useNavigation } from '@react-navigation/native';
import { ChevronRight, Dog } from 'lucide-react-native';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPetDetailsAction } from '../../../sagas/pets/fetchPetDetails/action';
import { fetchPetProfilePictureAction } from '../../../sagas/pets/fetchPetProfilePicture/action';
import { selectClientPets } from '../../../state/clientDetails/clientDetailsSlice';
import PetProfilePicture from '../../atoms/PetProfilePicture/PetProfilePicture';

export default function ClientPetsList() {
  const dispatch = useDispatch();
  const pets = useSelector(selectClientPets);
  const navigation = useNavigation();

  const handlePetPress = (petId) => () => {
    dispatch(fetchPetDetailsAction(petId));
    dispatch(fetchPetProfilePictureAction(petId));
    navigation.navigate('PetDetails');
  };

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
        <TouchableOpacity
          onPress={handlePetPress(pet.pet_id)}
          key={pet.pet_id}
          activeOpacity={0.4}
          className={`bg-white rounded-lg p-4 ${
            index === 0 ? 'mt-4' : 'mt-2'
          } ${index === pets.length - 1 ? 'mb-4' : 'mb-2'}`}
        >
          <View className="flex-row items-center mb-2">
            <View className="mr-4">
              <PetProfilePicture
                pet={{ pet_data: { breed: pet.breed, deceased: pet.deceased } }}
                size={60}
              />
            </View>
            <View className="flex-1">
              <Text className="text-2xl font-hn-bold mb-2">{pet.name}</Text>
              <View className="flex-row items-center gap-1">
                <Text className="text-lg font-hn-medium">Breed:</Text>
                <Text className="text-lg font-hn-regular">{pet.breed}</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Text className="text-lg font-hn-medium">Age:</Text>
                <Text className="text-lg font-hn-regular">
                  {pet.age} years old
                </Text>
              </View>
            </View>
            <ChevronRight size={32} />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
