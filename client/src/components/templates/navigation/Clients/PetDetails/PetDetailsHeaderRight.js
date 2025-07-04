import { useActionSheet } from '@expo/react-native-action-sheet';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Text, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClientDetailsAction } from '../../../../../sagas/clients/fetchClientDetails/action';
import { deletePetProfilePictureAction } from '../../../../../sagas/pets/deletePetProfilePicture/action';
import { deletePetsAction } from '../../../../../sagas/pets/deletePets/action';
import { updatePetIsDeceasedAction } from '../../../../../sagas/pets/updatePetIsDeceased/action';
import { uploadPetProfilePictureAction } from '../../../../../sagas/pets/uploadPetProfilePicture/action';
import { selectClientDetails } from '../../../../../state/clientDetails/clientDetailsSlice';
import {
  selectPetDetails,
  selectPetProfilePicture,
} from '../../../../../state/petDetails/petDetailsSlice';

export default function PetDetailsHeaderRight({ navigation }) {
  const dispatch = useDispatch();
  const clientDetails = useSelector(selectClientDetails);
  const petDetails = useSelector(selectPetDetails);
  const petProfilePicture = useSelector(selectPetProfilePicture);
  const { showActionSheetWithOptions } = useActionSheet();

  const handleImageUpload = async () => {
    try {
      // Request permissions
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'Permission to access camera roll is required!',
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        // Extract file extension from URI
        const uriParts = asset.uri.split('.');
        const fileExtension = uriParts[uriParts.length - 1].toLowerCase();

        // Validate file type
        const allowedExtensions = ['jpg', 'jpeg', 'png'];
        if (!allowedExtensions.includes(fileExtension)) {
          Alert.alert(
            'Invalid File Type',
            'Please select a JPG, JPEG, or PNG image.',
          );
          return;
        }

        // Create FormData compatible object
        const imageFile = {
          uri: asset.uri,
          type: `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`,
          name: `profile-${petDetails.pet_data.id}.${fileExtension}`,
        };

        // Dispatch upload action
        dispatch(
          uploadPetProfilePictureAction({
            petId: petDetails.pet_data.id,
            image: imageFile,
            ext: fileExtension,
          }),
        );

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const handleDeleteProfilePicture = () => {
    Alert.alert(
      'Delete Profile Picture',
      'Are you sure you want to delete this profile picture?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deletePetProfilePictureAction(petDetails.pet_data.id));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ],
    );
  };

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

  const handleCameraCapture = async () => {
    try {
      // Request camera permissions
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (cameraPermission.granted === false) {
        Alert.alert(
          'Permission Required',
          'Permission to access camera is required!',
        );
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        // Extract file extension from URI
        const uriParts = asset.uri.split('.');
        const fileExtension =
          uriParts[uriParts.length - 1].toLowerCase() || 'jpg';

        // Create FormData compatible object
        const imageFile = {
          uri: asset.uri,
          type: `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`,
          name: `profile-${petDetails.pet_data.id}.${fileExtension}`,
        };

        // Dispatch upload action
        dispatch(
          uploadPetProfilePictureAction({
            petId: petDetails.pet_data.id,
            image: imageFile,
            ext: fileExtension,
          }),
        );

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handleEditPress = () => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const deceasedOption = petDetails.pet_data.deceased
      ? 'Mark as Active'
      : 'Mark as Deceased';

    // Always include all options
    const options = [
      deceasedOption,
      'Take Photo',
      'Upload from Gallery',
      'Delete Profile Picture',
      'Edit Pet',
      'Delete Pet',
      'Cancel',
    ];

    const cancelButtonIndex = options.length - 1;
    const disabledButtonIndices = petProfilePicture ? [] : [3];
    const destructiveButtonIndex = 5;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        disabledButtonIndices,
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
          case 0: {
            dispatch(
              updatePetIsDeceasedAction({
                petId: petDetails.pet_data.id,
                isDeceased: !petDetails.pet_data.deceased,
              }),
            );

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;
          }
          case 1: {
            handleCameraCapture();
            break;
          }
          case 2: {
            handleImageUpload();
            break;
          }
          case 3: {
            if (petProfilePicture) {
              handleDeleteProfilePicture();
            }
            break;
          }
          case 4: {
            navigation.navigate('PetForm');
            break;
          }
          case 5: {
            handleDeletePet();
            break;
          }
          case 6: {
            break;
          }
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
