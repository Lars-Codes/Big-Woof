import { useActionSheet } from '@expo/react-native-action-sheet';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { ChevronRight, Trash2, Pin } from 'lucide-react-native';
import React, { useRef, useEffect, useCallback, memo, useMemo } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SwipeRow } from 'react-native-swipe-list-view';
import { useDispatch, useSelector } from 'react-redux';
import { deleteClientAction } from '../../../sagas/clients/deleteClient/action';
import { fetchClientAppointmentsAction } from '../../../sagas/clients/fetchClientAppointments/action';
import { fetchClientDetailsAction } from '../../../sagas/clients/fetchClientDetails/action';
import { fetchClientDocumentsAction } from '../../../sagas/clients/fetchClientDocuments/action';
import { fetchClientProfilePictureAction } from '../../../sagas/clients/fetchClientProfilePicture/action';
import { fetchClientStatsAction } from '../../../sagas/clients/fetchClientStats/action';
import { updateClientIsFavoriteAction } from '../../../sagas/clients/updateClientIsFavorite/action';
import { setClientSelectedInfo } from '../../../state/clientDetails/clientDetailsSlice';
import {
  selectDeleteMode,
  setDeleteMode,
  toggleClientSelection,
  selectHideHeaders,
} from '../../../state/clients/clientsSlice';
import CustomCheckbox from '../../atoms/CustomCheckbox/CustomCheckbox';

export default memo(
  function ClientItem({ client }) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const rowRef = useRef(null);
    const deleteMode = useSelector(selectDeleteMode);
    const hideHeaders = useSelector(selectHideHeaders);
    const isClientSelected = useMemo(() => {
      return client.isSelected || false;
    }, [client.isSelected]);
    const { showActionSheetWithOptions } = useActionSheet();

    useEffect(() => {
      if (deleteMode && rowRef.current) {
        rowRef.current.closeRow();
      }
    }, [deleteMode]);

    // Memoize callbacks to prevent unnecessary re-renders
    const handleClientPress = useCallback(() => {
      if (deleteMode) {
        dispatch(toggleClientSelection(client.client_id));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        return;
      }
      dispatch(setClientSelectedInfo('pets')); // Reset to pets view
      batchFetch(); // Fetch all necessary data for the client
      navigation.navigate('ClientDetails');
    }, [deleteMode, client.client_id, dispatch, navigation]);

    const handleClientLongPress = useCallback(() => {
      if (!deleteMode) {
        // iOS-style haptic feedback
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Close any open swipe rows
        if (rowRef.current) {
          rowRef.current.closeRow();
        }

        // Define action sheet options
        const favoriteOption = client.favorite
          ? 'Remove from Pinned'
          : 'Add to Pinned';

        const options = [
          'View Details',
          'Edit Client',
          favoriteOption,
          'Select Client',
          'Delete Client',
          'Cancel',
        ];

        const destructiveButtonIndex = 4; // Delete option
        const cancelButtonIndex = 5; // Cancel option

        showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex,
            destructiveButtonIndex,
            title: `${client.fname} ${client.lname}`,
            // iOS styling
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
              case 0: // View Details
                batchFetch(); // Fetch all necessary data for the client
                navigation.navigate('ClientDetails');
                break;

              case 1: // Edit Client
                batchFetch(); // Fetch all necessary data for the client
                navigation.navigate('ClientForm');
                break;

              case 2: // Add to Favorites
                // Dispatch the saga action
                dispatch(
                  updateClientIsFavoriteAction({
                    clientId: client.client_id,
                    isFavorite: !client.favorite,
                  }),
                );
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success,
                );
                // Alert.alert(
                //   'Success',
                //   `${client.fname} ${client.lname} added to favorites!`,
                // );
                break;
              case 3: // Select Client
                // Toggle selection and enter delete mode
                dispatch(toggleClientSelection(client.client_id));
                dispatch(setDeleteMode(true));
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                break;
              case 4: // Delete Client
                confirmDelete();
                break;

              case 5: // Cancel
                // Do nothing
                break;
            }
          },
        );
      }
    }, [deleteMode, client, dispatch, navigation, showActionSheetWithOptions]);

    const confirmDelete = useCallback(() => {
      Alert.alert(
        'Delete Client',
        `Are you sure you want to delete ${client.fname} ${client.lname}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              if (rowRef.current) {
                rowRef.current.closeRow();
              }
            },
          },
          {
            text: 'Delete',
            onPress: () => {
              dispatch(deleteClientAction([client.client_id]));
              if (rowRef.current) {
                rowRef.current.closeRow();
              }
              // Success haptic feedback
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              );
            },
            style: 'destructive',
          },
        ],
      );
    }, [client.fname, client.lname, client.client_id, dispatch]);

    const handleCheckboxChange = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      dispatch(toggleClientSelection(client.client_id));
    }, [client.client_id, dispatch]);

    const batchFetch = useCallback(() => {
      dispatch(fetchClientDetailsAction(client.client_id));
      dispatch(fetchClientStatsAction(client.client_id));
      dispatch(fetchClientDocumentsAction(client.client_id));
      dispatch(fetchClientAppointmentsAction(client.client_id));
      dispatch(fetchClientProfilePictureAction(client.client_id));
    }, [client.client_id, dispatch]);

    return (
      <SwipeRow
        ref={rowRef}
        leftOpenValue={60}
        disableLeftSwipe={true}
        disableRightSwipe={true}
        swipeToOpenPercent={40}
        swipeToClosePercent={10}
        friction={100}
        tension={100}
        stopLeftSwipe={deleteMode ? 0 : undefined}
        stopRightSwipe={deleteMode ? 0 : undefined}
      >
        <View className="flex-1 flex-row justify-start border-b border-gray-200 bg-red-500">
          <TouchableOpacity
            onPress={confirmDelete}
            className="bg-red-500 w-[60px] h-full justify-center items-center"
          >
            <Trash2 size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View className={`${isClientSelected ? 'bg-gray-100' : 'bg-white'}`}>
          <TouchableOpacity
            onPress={handleClientPress}
            onLongPress={handleClientLongPress}
            activeOpacity={0.4}
            className="flex-row items-center justify-between py-3 px-5 border-b border-gray-200"
            style={{ minHeight: 56 }}
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-3xl text-gray-800 font-hn-medium">
                {client.fname} {client.lname}
              </Text>
              {hideHeaders && client.favorite ? (
                <Pin size={16} color="#000" fill="#999" />
              ) : null}
            </View>
            {deleteMode ? (
              <CustomCheckbox
                value={isClientSelected}
                onValueChange={handleCheckboxChange}
                className="mr-2"
              />
            ) : (
              <ChevronRight size={32} />
            )}
          </TouchableOpacity>
        </View>
      </SwipeRow>
    );
  },
  (prevProps, nextProps) => {
    // More specific comparison to reduce re-renders
    const prevClient = prevProps.client;
    const nextClient = nextProps.client;

    return (
      prevClient.client_id === nextClient.client_id &&
      prevClient.isSelected === nextClient.isSelected &&
      prevClient.fname === nextClient.fname &&
      prevClient.lname === nextClient.lname &&
      prevClient.favorite === nextClient.favorite
    );
  },
);
