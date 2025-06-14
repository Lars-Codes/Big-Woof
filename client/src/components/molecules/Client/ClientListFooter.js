import * as Blur from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef } from 'react';
import { Text, View, Animated, Alert, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteClientAction } from '../../../sagas/clients/deleteClient/action';
import {
  selectDeleteMode,
  setDeleteMode,
  batchUpdateSelection,
  selectSelectedClientsCount,
  selectSelectedClientIds,
  selectIsAllClientsSelected,
  selectClientsResultSet,
} from '../../../state/clients/clientsSlice';

export default function ClientListFooter() {
  const dispatch = useDispatch();
  const deleteMode = useSelector(selectDeleteMode);
  const selectedCount = useSelector(selectSelectedClientsCount);
  const selectedClientIds = useSelector(selectSelectedClientIds);
  const isAllSelected = useSelector(selectIsAllClientsSelected);
  const clientsResultSet = useSelector(selectClientsResultSet);

  const slideAnim = useRef(new Animated.Value(100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const handleSelectAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (isAllSelected) {
      // Get all client IDs and batch deselect
      const allClientIds = clientsResultSet.map((client) => client.client_id);
      dispatch(
        batchUpdateSelection({ clientIds: allClientIds, isSelected: false }),
      );
    } else {
      // Get all client IDs and batch select
      const allClientIds = clientsResultSet.map((client) => client.client_id);
      dispatch(
        batchUpdateSelection({ clientIds: allClientIds, isSelected: true }),
      );
    }
  };

  const handleConfirmDelete = () => {
    if (selectedCount === 0) {
      handleCancel();
      return;
    }

    // Medium haptic feedback when initiating delete action
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

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
            dispatch(deleteClientAction(selectedClientIds));
            dispatch(setDeleteMode(false));
            // Success haptic feedback after deletion
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
          style: 'destructive',
        },
      ],
    );
  };

  const handleCancel = () => {
    // Light haptic feedback for cancel action
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    dispatch(setDeleteMode(false));
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
      <View className="flex flex-row items-center justify-between py-4 px-6">
        <TouchableOpacity
          onPress={handleSelectAll}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text className="text-2xl font-hn-medium text-blue-500 underline">
            {isAllSelected ? 'Deselect All' : 'Select All'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleConfirmDelete}
          disabled={selectedCount === 0}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text
            className={`text-2xl font-hn-medium underline ${selectedCount > 0 ? 'text-blue-500' : 'text-gray-300'}`}
          >
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
