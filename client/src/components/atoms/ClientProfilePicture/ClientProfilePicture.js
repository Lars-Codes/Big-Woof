import { useActionSheet } from '@expo/react-native-action-sheet';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';
import React from 'react';
import { Image, View, Text, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteClientProfilePictureAction } from '../../../sagas/clients/deleteClientProfilePicture/action';
import { uploadClientProfilePictureAction } from '../../../sagas/clients/uploadClientProfilePicture/action';
import {
  selectClientDetails,
  selectClientProfilePicture,
} from '../../../state/clientDetails/clientDetailsSlice';

export default function ClientProfilePicture({ children, size = 100 }) {
  const dispatch = useDispatch();
  const client = useSelector(selectClientDetails);
  const clientProfilePicture = useSelector(selectClientProfilePicture);
  const { showActionSheetWithOptions } = useActionSheet();

  // Only show default image if there's no profile picture
  const shouldUseDefaultImage = !clientProfilePicture;

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
          name: `profile-${client?.client_data.client_id}.${fileExtension}`,
        };

        // Dispatch upload action
        dispatch(
          uploadClientProfilePictureAction({
            clientId: client?.client_data.client_id,
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
          name: `profile-${client?.client_data.client_id}.${fileExtension}`,
        };

        // Dispatch upload action
        dispatch(
          uploadClientProfilePictureAction({
            clientId: client?.client_data.client_id,
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
              deleteClientProfilePictureAction(client?.client_data.client_id),
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
    const disabledButtonIndices = clientProfilePicture ? [] : [2];
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
            if (clientProfilePicture) {
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

  if (shouldUseDefaultImage) {
    return (
      <View className="items-center mt-4 mb-2">
        <View className="relative">
          <View
            className="rounded-full bg-gray-300 justify-center items-center"
            style={{ width: size, height: size }}
          >
            <Text
              className="font-hn-bold text-black text-6xl p-4 mt-2"
              style={{
                textShadowColor: 'rgba(0, 0, 0, 0.4)',
                textShadowOffset: { width: 0, height: 4 },
                textShadowRadius: 12,
              }}
            >
              {client?.client_data?.fname?.charAt(0).toUpperCase() +
                client?.client_data?.lname?.charAt(0).toUpperCase()}
            </Text>
          </View>
          {children}
          {renderCameraButton()}
        </View>
      </View>
    );
  }

  const imageUri = clientProfilePicture?.startsWith('data:')
    ? clientProfilePicture
    : `data:image/jpeg;base64,${clientProfilePicture}`;

  return (
    <View className="items-center mt-4 mb-2">
      <View className="relative">
        <Image
          source={{ uri: imageUri }}
          className="w-[100px] h-[100px] rounded-full"
        />
        {children}
        {renderCameraButton()}
      </View>
    </View>
  );
}
