import { useActionSheet } from '@expo/react-native-action-sheet';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { ChevronRight } from 'lucide-react-native';
import React, { useCallback, memo, useMemo } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { deletePetsAction } from '../../../sagas/pets/deletePets/action';
import { fetchPetDetailsAction } from '../../../sagas/pets/fetchPetDetails/action';
import { fetchPetProfilePictureAction } from '../../../sagas/pets/fetchPetProfilePicture/action';
import {
  selectDeleteMode,
  setDeleteMode,
  togglePetSelection,
} from '../../../state/pets/petsSlice';
import CustomCheckbox from '../../atoms/CustomCheckbox/CustomCheckbox';

export default memo(
  function PetItem({ pet }) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const deleteMode = useSelector(selectDeleteMode);
    const isPetSelected = useMemo(() => {
      return pet.isSelected || false;
    }, [pet.isSelected]);
    const { showActionSheetWithOptions } = useActionSheet();

    const handlePetPress = useCallback(() => {
      if (deleteMode) {
        dispatch(togglePetSelection(pet.pet_id));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        return;
      }
      batchFetch(); // Fetch all necessary data for the pet
      navigation.navigate('PetDetails');
    }, [deleteMode, pet.pet_id, dispatch, navigation]);

    const handlePetLongPress = useCallback(() => {
      if (!deleteMode) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        const options = [
          'View Details',
          'Edit Pet',
          'Select Pet',
          'Delete Pet',
          'Cancel',
        ];

        const destructiveButtonIndex = 3;
        const cancelButtonIndex = 4;

        showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex,
            destructiveButtonIndex,
            title: `${pet.name}`,
            tintColor: '#007AFF', // iOS blue
            containerStyle: {
              backgroundColor: 'rgba(255, 255, 255, 0.95)', // Slightly transparent
            },
            textStyle: {
              fontSize: 18,
            },
          },
          (selectedIndex) => {
            switch (selectedIndex) {
              case 0:
                batchFetch();
                navigation.navigate('PetDetails');
                break;
              case 1:
                batchFetch();
                navigation.navigate('PetForm');
                break;
              case 2:
                dispatch(togglePetSelection(pet.pet_id));
                dispatch(setDeleteMode(true));
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                break;
              case 3:
                confirmDelete();
                break;
              case 4:
                break;
            }
          },
        );
      }
    }, [deleteMode, pet, dispatch, navigation, showActionSheetWithOptions]);

    const confirmDelete = useCallback(() => {
      Alert.alert(
        'Delete Pet',
        `Are you sure you want to delete ${pet.name}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {},
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              dispatch(deletePetsAction([pet.pet_id]));
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              );
            },
          },
        ],
      );
    }, [pet.name, pet.id, dispatch]);

    const handleCheckboxChange = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      dispatch(togglePetSelection(pet.pet_id));
    }, [pet.pet_id, dispatch]);

    const batchFetch = useCallback(() => {
      dispatch(fetchPetDetailsAction(pet.pet_id));
      dispatch(fetchPetProfilePictureAction(pet.pet_id));
    }, [dispatch, pet.pet_id]);

    return (
      <View className={`${isPetSelected ? 'bg-gray-100' : 'bg-white'}`}>
        <TouchableOpacity
          onPress={handlePetPress}
          onLongPress={handlePetLongPress}
          activeOpacity={0.4}
          className="flex-row items-center justify-between py-3 px-5 border-b border-gray-200"
          style={{ minHeight: 56 }}
        >
          <View className="flex items-start">
            <Text className="text-3xl text-gray-800 font-hn-medium">
              {pet.name}
            </Text>
            <Text className="text-base text-gray-500 font-hn-medium">
              {pet.client_fname} {pet.client_lname}
            </Text>
          </View>
          {deleteMode ? (
            <CustomCheckbox
              value={isPetSelected}
              onValueChange={handleCheckboxChange}
              className="mr-2"
            />
          ) : (
            <ChevronRight size={32} />
          )}
        </TouchableOpacity>
      </View>
    );
  },
  (prevProps, nextProps) => {
    // More specific comparison to reduce re-renders
    const prevPet = prevProps.pet;
    const nextPet = nextProps.pet;

    return (
      prevPet.pet_id === nextPet.pet_id &&
      prevPet.isSelected === nextPet.isSelected &&
      prevPet.name === nextPet.name
    );
  },
);
