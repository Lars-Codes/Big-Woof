import { useActionSheet } from '@expo/react-native-action-sheet';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateClientIsFavoriteAction } from '../../../../../sagas/clients/updateClientIsFavorite/action';
import { selectClientDetails } from '../../../../../state/clientDetails/clientDetailsSlice';

export default function ClientDetailsHeaderRight({ navigation }) {
  const dispatch = useDispatch();
  const clientDetails = useSelector(selectClientDetails);
  const { showActionSheetWithOptions } = useActionSheet();

  const handleEditPress = () => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Define action sheet options
    const favoriteOption = clientDetails?.client_data.favorite
      ? 'Remove from Pinned'
      : 'Add to Pinned';

    const options = [favoriteOption, 'Edit Client', 'Cancel'];

    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
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
              updateClientIsFavoriteAction({
                clientId: clientDetails?.client_data.client_id,
                isFavorite: !clientDetails?.client_data.favorite,
              }),
            );

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;
          }
          case 1: {
            navigation.navigate('ClientForm');
            break;
          }
          case 2: {
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
      <Text className="text-2xl font-hn-medium text-blue-500">
        Edit
      </Text>
    </TouchableOpacity>
  );
}
