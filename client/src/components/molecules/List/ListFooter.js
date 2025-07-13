import * as Blur from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef } from 'react';
import { Text, View, Animated, Alert, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteClientsAction } from '../../../sagas/clients/deleteClients/action';
import { deletePetsAction } from '../../../sagas/pets/deletePets/action';
import * as ClientsSlice from '../../../state/clients/clientsSlice';
import { selectListType } from '../../../state/list/listSlice';
import * as PetSlice from '../../../state/pets/petsSlice';

export default function ListFooter() {
  const dispatch = useDispatch();
  const listType = useSelector(selectListType);

  // Check both delete modes
  const clientDeleteMode = useSelector(ClientsSlice.selectDeleteMode);
  const petDeleteMode = useSelector(PetSlice.selectDeleteMode);
  const deleteMode = clientDeleteMode || petDeleteMode;

  const selectedCount = useSelector(
    listType === 'Clients'
      ? ClientsSlice.selectSelectedClientsCount
      : PetSlice.selectSelectedPetsCount,
  );
  const selectedIds = useSelector(
    listType === 'Clients'
      ? ClientsSlice.selectSelectedClientIds
      : PetSlice.selectSelectedPetIds,
  );
  const isAllSelected = useSelector(
    listType === 'Clients'
      ? ClientsSlice.selectIsAllClientsSelected
      : PetSlice.selectIsAllPetsSelected,
  );
  const resultSet = useSelector(
    listType === 'Clients'
      ? ClientsSlice.selectClientsResultSet
      : PetSlice.selectPetsResultSet,
  );

  const slideAnim = useRef(new Animated.Value(100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const handleSelectAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (isAllSelected) {
      // Get all IDs and batch deselect
      const allIds = resultSet.map((item) =>
        listType === 'Clients' ? item.client_id : item.pet_id,
      );
      if (listType === 'Clients') {
        dispatch(
          ClientsSlice.batchUpdateSelection({
            clientIds: allIds,
            isSelected: false,
          }),
        );
      } else {
        dispatch(
          PetSlice.batchUpdateSelection({
            petIds: allIds,
            isSelected: false,
          }),
        );
      }
    } else {
      // Get all IDs and batch select
      const allIds = resultSet.map((item) =>
        listType === 'Clients' ? item.client_id : item.pet_id,
      );
      if (listType === 'Clients') {
        dispatch(
          ClientsSlice.batchUpdateSelection({
            clientIds: allIds,
            isSelected: true,
          }),
        );
      } else {
        dispatch(
          PetSlice.batchUpdateSelection({
            petIds: allIds,
            isSelected: true,
          }),
        );
      }
    }
  };

  const handleConfirmDelete = () => {
    if (selectedCount === 0) {
      handleCancel();
      return;
    }

    // Medium haptic feedback when initiating delete action
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (listType === 'Clients') {
      Alert.alert(
        'Delete Selected Clients',
        `Are you sure you want to delete ${selectedCount} selected client${selectedCount > 1 ? 's' : ''}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              // Light haptic feedback for cancel
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            },
          },
          {
            text: 'Delete',
            onPress: () => {
              dispatch(
                deleteClientsAction({
                  clientIds: selectedIds,
                  onSuccess: () => {
                    // Cancel both delete modes
                    dispatch(ClientsSlice.setDeleteMode(false));
                    dispatch(PetSlice.setDeleteMode(false));
                    // Success haptic feedback after deletion
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Success,
                    );
                    // Optional: Show success message
                    // Alert.alert('Success', `${selectedCount} client${selectedCount > 1 ? 's' : ''} deleted successfully!`);
                  },
                  onError: (error) => {
                    // Error haptic feedback
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Error,
                    );
                    Alert.alert(
                      'Delete Failed',
                      `Failed to delete selected clients. Please try again.`,
                    );
                    console.error('Error deleting clients:', error);
                  },
                }),
              );
            },
            style: 'destructive',
          },
        ],
      );
    } else {
      Alert.alert(
        'Delete Selected Pets',
        `Are you sure you want to delete ${selectedCount} selected pet${selectedCount > 1 ? 's' : ''}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              // Light haptic feedback for cancel
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            },
          },
          {
            text: 'Delete',
            onPress: () => {
              dispatch(
                deletePetsAction({
                  petIds: selectedIds,
                  onSuccess: () => {
                    // Cancel both delete modes
                    dispatch(ClientsSlice.setDeleteMode(false));
                    dispatch(PetSlice.setDeleteMode(false));
                    // Success haptic feedback after deletion
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Success,
                    );
                    // Optional: Show success message
                    // Alert.alert('Success', `${selectedCount} pet${selectedCount > 1 ? 's' : ''} deleted successfully!`);
                  },
                  onError: (error) => {
                    // Error haptic feedback
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Error,
                    );
                    Alert.alert(
                      'Delete Failed',
                      `Failed to delete selected pets. Please try again.`,
                    );
                    console.error('Error deleting pets:', error);
                  },
                }),
              );
            },
            style: 'destructive',
          },
        ],
      );
    }
  };

  const handleCancel = () => {
    // Light haptic feedback for cancel action
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Cancel both delete modes
    dispatch(ClientsSlice.setDeleteMode(false));
    dispatch(PetSlice.setDeleteMode(false));
  };

  useEffect(() => {
    if (deleteMode) {
      // Spring animation for iOS-like feel
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [deleteMode, slideAnim, opacityAnim]);

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        opacity: opacityAnim,
        position: 'relative',
      }}
      pointerEvents={deleteMode ? 'auto' : 'none'}
    >
      <Blur.BlurView
        intensity={80}
        tint="light"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
        }}
      />
      <View className="flex flex-row items-center py-4 px-6">
        <TouchableOpacity
          onPress={handleSelectAll}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="flex-1"
        >
          <Text className="text-2xl font-hn-medium text-blue-500 text-left">
            {isAllSelected ? 'Deselect All' : 'Select All'}
          </Text>
        </TouchableOpacity>

        <View className="flex-1">
          <Text className="text-2xl font-hn-medium text-center">
            {selectedCount} Selected
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleConfirmDelete}
          disabled={selectedCount === 0}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="flex-1"
        >
          <Text
            className={`text-2xl font-hn-medium text-right ${selectedCount > 0 ? 'text-blue-500' : 'text-gray-300'}`}
          >
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
