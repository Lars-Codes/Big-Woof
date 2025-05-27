import { useNavigation } from '@react-navigation/native';
import { ChevronRight, CircleCheck, Trash2, Circle } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SwipeRow } from 'react-native-swipe-list-view';
import { useDispatch, useSelector } from 'react-redux';
import { deleteClientAction } from '../../../sagas/clients/deleteClient/action';
import { fetchClientDetailsAction } from '../../../sagas/clients/fetchClientDetails/action';
import { fetchClientProfilePictureAction } from '../../../sagas/clients/fetchClientProfilePicture/action';
import {
  selectDeleteMode,
  setDeleteMode,
  addClientToDeleteSet,
  removeClientFromDeleteSet,
  selectClientsDeleteSet,
  selectCloseAllRows,
} from '../../../state/clients/clientsSlice';

export default function ClientItem({ client }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isRowOpen, setIsRowOpen] = useState(false);
  const rowRef = useRef(null);
  const deleteMode = useSelector(selectDeleteMode);
  const clientsDeleteSet = useSelector(selectClientsDeleteSet);
  const isClientInDeleteSet = clientsDeleteSet.includes(client.client_id);
  const closeAllRows = useSelector(selectCloseAllRows);

  useEffect(() => {
    if (deleteMode && rowRef.current) {
      rowRef.current.manuallySwipeRow(60);
    }
  }, [deleteMode]);

  useEffect(() => {
    if (closeAllRows && rowRef.current) {
      rowRef.current.closeRow();
    }
  }, [closeAllRows]);

  const handleClientPress = (client) => {
    if (deleteMode) {
      if (isClientInDeleteSet) {
        dispatch(removeClientFromDeleteSet(client.client_id));
      } else {
        dispatch(addClientToDeleteSet(client.client_id));
      }
      return;
    }
    dispatch(fetchClientDetailsAction(client.client_id));
    dispatch(fetchClientProfilePictureAction(client.client_id));
    navigation.navigate('ClientDetails');
  };

  const handleClientLongPress = (client) => {
    if (!deleteMode) {
      dispatch(addClientToDeleteSet(client.client_id));
      dispatch(setDeleteMode(true));
    }
  };

  const confirmDelete = () => {
    if (clientsDeleteSet.length === 0) {
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
            },
            style: 'destructive',
          },
        ],
      );
    }
  };

  const handleRowOpen = () => {
    if (isRowOpen && !deleteMode) {
      confirmDelete();
    } else {
      setIsRowOpen(true);
    }
  };

  const handleRowClose = () => {
    setIsRowOpen(false);
  };

  return (
    <SwipeRow
      ref={rowRef}
      leftOpenValue={60}
      disableLeftSwipe={true}
      disableRightSwipe={deleteMode}
      swipeToOpenPercent={40}
      onRowOpen={handleRowOpen}
      onRowClose={handleRowClose}
      swipeToClosePercent={10}
      friction={100}
      tension={100}
      stopLeftSwipe={deleteMode ? 60 : undefined}
      stopRightSwipe={deleteMode ? 60 : undefined}
    >
      <View
        className={`flex-1 flex-row justify-start border-b border-gray-200 ${closeAllRows ? '' : 'bg-red-500'} `}
      >
        {deleteMode ? (
          <TouchableOpacity
            onPress={() => handleClientPress(client)}
            className={`w-[60px] h-full justify-center items-center ${isClientInDeleteSet ? 'bg-red-500' : 'bg-gray-500'}`}
          >
            {isClientInDeleteSet ? (
              <CircleCheck size={24} color="white" />
            ) : (
              <Circle size={24} color="white" />
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={confirmDelete}
            className="bg-red-500 w-[60px] h-full justify-center items-center"
          >
            <Trash2 size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
      <View className="bg-white">
        <TouchableOpacity
          onPress={() => handleClientPress(client)}
          onLongPress={() => handleClientLongPress(client)}
          activeOpacity={0.4}
          className="flex-row items-center justify-between py-3 px-5 border-b border-gray-200"
          style={{ minHeight: 56 }}
        >
          <Text className="text-3xl text-gray-800 font-hn-medium">
            {client.fname} {client.lname}
          </Text>
          <ChevronRight size={32} />
        </TouchableOpacity>
      </View>
    </SwipeRow>
  );
}
