import { useActionSheet } from '@expo/react-native-action-sheet';
import { useNavigation } from '@react-navigation/native';
import { Ellipsis } from 'lucide-react-native';
import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClientDetailsAction } from '../../../sagas/clients/fetchClientDetails/action';
import { deletePetsAction } from '../../../sagas/pets/deletePets/action';
import { fetchPetDetailsAction } from '../../../sagas/pets/fetchPetDetails/action';
import { fetchPetProfilePictureAction } from '../../../sagas/pets/fetchPetProfilePicture/action';
import {
  selectClientDetails,
  selectClientPets,
} from '../../../state/clientDetails/clientDetailsSlice';
import { setPetDetails } from '../../../state/petDetails/petDetailsSlice';
import PetProfilePicture from '../../atoms/PetProfilePicture/PetProfilePicture';
import MiniList from '../../molecules/List/MiniList';

export default function ClientPetsList() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const clientDetails = useSelector(selectClientDetails);
  const pets = useSelector(selectClientPets);
  const { showActionSheetWithOptions } = useActionSheet();

  const handleEdit = (pet) => {
    // action sheet with the options to edit or delete
    const options = ['Edit Pet', 'View Details', 'Delete Pet', 'Cancel'];
    const destructiveButtonIndex = 2;
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            // Edit Pet
            handleEditPet(pet);
            break;
          case 1:
            // View Details
            handleViewPetDetails(pet);
            break;
          case 2:
            // Delete Pet
            handleDeletePet(pet);
            break;
          case 3:
            // Cancel
            break;
        }
      },
    );
  };

  const handleEditPet = (pet) => {
    // Set pet details for editing
    dispatch(fetchPetDetailsAction(pet.pet_id));
    dispatch(fetchPetProfilePictureAction(pet.pet_id));
    navigation.navigate('PetForm');
  };

  const handleViewPetDetails = (pet) => {
    dispatch(fetchPetDetailsAction(pet.pet_id));
    dispatch(fetchPetProfilePictureAction(pet.pet_id));
    navigation.navigate('PetDetails');
  };

  const handleDeletePet = (pet) => {
    Alert.alert('Delete Pet', `Are you sure you want to delete ${pet.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          dispatch(
            deletePetsAction({
              petIds: [pet.pet_id],
              onSuccess: () => {
                Alert.alert('Success', `${pet.name} has been deleted.`);
              },
              onError: (error) => {
                console.error('Failed to delete pet:', error);
                Alert.alert('Error', 'Failed to delete pet. Please try again.');
              },
            }),
          );
        },
      },
    ]);
  };

  const handleAddPet = () => {
    dispatch(setPetDetails(null));
    dispatch(setPetDetails({ client_id: clientDetails.client_data.client_id }));
    navigation.navigate('PetForm');
  };

  const renderPetItem = (pet) => (
    <TouchableOpacity
      onPress={() => handleViewPetDetails(pet)}
      activeOpacity={0.7}
      className="flex-1"
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-row items-center flex-1">
          <View className="mr-4">
            <PetProfilePicture
              pet={pet}
              profilePicture={pet.profile_picture}
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
        </View>

        <View className="flex-row space-x-2">
          <TouchableOpacity onPress={() => handleEdit(pet)} activeOpacity={0.7}>
            <Ellipsis size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <MiniList
      data={pets || []}
      renderItem={renderPetItem}
      onRefresh={() => {
        dispatch(
          fetchClientDetailsAction(clientDetails.client_data.client_id, false),
        );
      }}
      onAddPress={handleAddPet}
      addButtonText="Add Pet"
    />
  );
}
