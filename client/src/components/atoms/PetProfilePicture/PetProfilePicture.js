import { useActionSheet } from '@expo/react-native-action-sheet';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';
import React from 'react';
import { Image, View, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchClientDetailsAction } from '../../../sagas/clients/fetchClientDetails/action';
import { deletePetProfilePictureAction } from '../../../sagas/pets/deletePetProfilePicture/action';
import { uploadPetProfilePictureAction } from '../../../sagas/pets/uploadPetProfilePicture/action';
import {
  selectPetDetails,
  selectPetProfilePicture,
} from '../../../state/petDetails/petDetailsSlice';
import { getBreedImage } from '../../../utils/pets/petBreedImages';

export default function PetProfilePicture({
  children,
  pet: propPet,
  profilePicture: propProfilePicture,
  size = 100,
  showCameraButton = false,
}) {
  const dispatch = useDispatch();
  const pet = propPet || useSelector(selectPetDetails);
  const petProfilePicture =
    propProfilePicture !== undefined
      ? propProfilePicture
      : useSelector(selectPetProfilePicture);

  const { showActionSheetWithOptions } = useActionSheet();

  const isDeceased = pet?.pet_data?.deceased === 1;
  const shouldUseBreedImage = !petProfilePicture;

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
          name: `profile-${pet?.pet_data.id}.${fileExtension}`,
        };

        // Dispatch upload action
        dispatch(
          uploadPetProfilePictureAction({
            petId: pet?.pet_data.id,
            image: imageFile,
            ext: fileExtension,
            onSuccess: () => {
              dispatch(fetchClientDetailsAction(pet?.pet_data.owner_id));
              Alert.alert('Success', 'Profile picture uploaded successfully!');
            },
            onError: (errorMessage) => {
              Alert.alert(
                'Error',
                errorMessage ||
                  'Failed to upload profile picture. Please try again.',
              );
            },
          }),
        );

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
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
          name: `profile-${pet?.pet_data.id}.${fileExtension}`,
        };

        // Dispatch upload action
        dispatch(
          uploadPetProfilePictureAction({
            petId: pet?.pet_data.id,
            image: imageFile,
            ext: fileExtension,
            onSuccess: () => {
              dispatch(fetchClientDetailsAction(pet?.pet_data.owner_id));
              Alert.alert('Success', 'Profile picture uploaded successfully!');
            },
            onError: (errorMessage) => {
              Alert.alert(
                'Error',
                errorMessage ||
                  'Failed to upload profile picture. Please try again.',
              );
            },
          }),
        );

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
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
            dispatch(
              deletePetProfilePictureAction({
                petId: pet?.pet_data.id,
                onSuccess: () => {
                  dispatch(fetchClientDetailsAction(pet?.pet_data.owner_id));
                  Alert.alert(
                    'Success',
                    'Profile picture deleted successfully!',
                  );
                },
                onError: () => {
                  Alert.alert(
                    'Error',
                    'Failed to delete pet profile picture. Please try again.',
                  );
                },
              }),
            );
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ],
    );
  };

  const handleCameraPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const options = [
      'Take Photo',
      'Upload from Gallery',
      'Delete Profile Picture',
      'Cancel',
    ];

    const cancelButtonIndex = options.length - 1;
    const disabledButtonIndices = petProfilePicture ? [] : [2];
    const destructiveButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        disabledButtonIndices,
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
            handleCameraCapture();
            break;
          case 1:
            handleImageUpload();
            break;
          case 2:
            if (petProfilePicture) {
              handleDeleteProfilePicture();
            }
            break;
          case 3:
            break;
        }
      },
    );
  };

  const renderCameraButton = () => {
    // Only show plus icon if showCameraButton is true AND we're not in list view (no propPet)
    if (!showCameraButton) return null;

    const iconSize = 24;
    const iconStyle = {
      position: 'absolute',
      bottom: -2,
      right: -2,
      backgroundColor: 'white',
      borderRadius: 99,
      padding: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    };

    return (
      <TouchableOpacity
        style={iconStyle}
        activeOpacity={0.7}
        onPress={handleCameraPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Camera size={iconSize} color="#007AFF" />
      </TouchableOpacity>
    );
  };

  if (shouldUseBreedImage) {
    // Use breed-based image
    const breed = propPet ? propPet.breed : pet?.pet_data?.breed || '';
    const imageSource = getBreedImage(breed);

    return (
      <View className="items-center mt-4 mb-2">
        <View className="relative">
          <View
            className="rounded-full bg-gray-300 justify-center items-center"
            style={{ width: size, height: size, opacity: isDeceased ? 0.5 : 1 }}
          >
            <Image
              source={imageSource}
              style={{
                width: size * 0.8,
                height: size * 0.8,
                borderRadius: (size * 0.8) / 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 6,
                elevation: 8,
                overflow: 'visible',
              }}
              resizeMode="contain"
              fadeDuration={0}
            />
          </View>
          {children}
          {renderCameraButton()}
        </View>
      </View>
    );
  }

  // Use uploaded profile picture
  const imageUri = petProfilePicture?.startsWith('data:')
    ? petProfilePicture
    : `data:image/jpeg;base64,${petProfilePicture}`;

  return (
    <View className="items-center mt-4 mb-2">
      <View className="relative">
        <Image
          source={{ uri: imageUri }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            opacity: isDeceased ? 0.5 : 1,
          }}
        />
        {children}
        {renderCameraButton()}
      </View>
    </View>
  );
}
