import { useNavigation } from '@react-navigation/native';
import { ChevronRight, Trash2 } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SwipeRow } from 'react-native-swipe-list-view';
import { useDispatch } from 'react-redux';
import { deleteClientAction } from '../../../sagas/clients/deleteClient/action';
import { fetchClientDetailsAction } from '../../../sagas/clients/fetchClientDetails/action';
import { fetchClientProfilePictureAction } from '../../../sagas/clients/fetchClientProfilePicture/action';

export default function ClientItem({ client }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isRowOpen, setIsRowOpen] = useState(false);
  const rowRef = useRef(null);

  const handleClientPress = (client) => {
    dispatch(fetchClientDetailsAction(client.client_id));
    dispatch(fetchClientProfilePictureAction(client.client_id));
    navigation.navigate('ClientDetails');
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Client',
      `Are you sure you want to delete ${client.fname} ${client.lname}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            // Close the row when cancel is pressed
            if (rowRef.current) {
              rowRef.current.closeRow();
            }
          },
        },
        {
          text: 'Delete',
          onPress: () => {
            dispatch(deleteClientAction([client.client_id]));
            // Close the row after deleting
            if (rowRef.current) {
              rowRef.current.closeRow();
            }
          },
          style: 'destructive',
        },
      ],
    );
  };

  const handleRowOpen = () => {
    // If row is already open, trigger delete action on second swipe
    if (isRowOpen) {
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
      leftOpenValue={75}
      disableLeftSwipe={true}
      swipeToOpenPercent={40}
      onRowOpen={handleRowOpen}
      onRowClose={handleRowClose}
      swipeToClosePercent={10}
    >
      {/* Hidden View - Delete button */}
      <View className="flex-1 flex-row justify-start bg-red-500">
        <TouchableOpacity
          onPress={confirmDelete}
          className="bg-red-500 w-[75px] h-full justify-center items-center"
        >
          <Trash2 size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Visible Content */}
      <View className="bg-white">
        <TouchableOpacity
          onPress={() => handleClientPress(client)}
          activeOpacity={0.4}
          className="flex-row items-center justify-between p-4 border-b border-gray-200 bg-white"
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
