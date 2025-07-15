import { useActionSheet } from '@expo/react-native-action-sheet';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Text, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClientDetailsAction } from '../../../../../sagas/clients/fetchClientDetails/action';
import { deletePetsAction } from '../../../../../sagas/pets/deletePets/action';
import { fetchPetDetailsAction } from '../../../../../sagas/pets/fetchPetDetails/action';
import { updatePetIsDeceasedAction } from '../../../../../sagas/pets/updatePetIsDeceased/action';
import { selectClientDetails } from '../../../../../state/clientDetails/clientDetailsSlice';
import { selectPetDetails } from '../../../../../state/petDetails/petDetailsSlice';

export default function PetDetailsHeaderRight({ navigation }) {
  const dispatch = useDispatch();
  const clientDetails = useSelector(selectClientDetails);
  const petDetails = useSelector(selectPetDetails);
  const { showActionSheetWithOptions } = useActionSheet();

  const handleDeletePet = () => {
    Alert.alert(
      'Delete Pet',
      `Are you sure you want to delete ${petDetails.pet_data.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(
              deletePetsAction({
                petIds: [petDetails.pet_data.id],
                onSuccess: () => {
                  if (clientDetails) {
                    dispatch(
                      fetchClientDetailsAction(
                        clientDetails.client_data?.client_id,
                      ),
                    );
                  }
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success,
                  );
                  navigation.goBack();
                },
                onError: (error) => {
                  console.error('Failed to delete pet:', error);
                  Alert.alert(
                    'Error',
                    'Failed to delete pet. Please try again.',
                  );
                },
              }),
            );
          },
        },
      ],
    );
  };

  const handleEditPress = () => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const deceasedOption = petDetails.pet_data.deceased
      ? 'Mark as Active'
      : 'Mark as Deceased';

    // Always include all options
    const options = [deceasedOption, 'Edit Pet', 'Delete Pet', 'Cancel'];

    const cancelButtonIndex = options.length - 1;
    const destructiveButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        tintColor: '#007AFF',
        containerStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
        },
        textStyle: {
          fontSize: 18,
        },
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            dispatch(
              updatePetIsDeceasedAction({
                petId: petDetails.pet_data.id,
                isDeceased: !petDetails.pet_data.deceased,
              }),
            );

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;
          case 1:
            dispatch(fetchPetDetailsAction(petDetails.pet_data.id));
            navigation.navigate('PetForm');
            break;
          case 2:
            handleDeletePet();
            break;
          case 3:
            break;
        }
      },
    );
  };

  return (
    <TouchableOpacity
      className="mr-2"
      onPress={handleEditPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text className="text-2xl font-hn-medium text-blue-500">Edit</Text>
    </TouchableOpacity>
  );
}
