import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectDeleteMode,
  setDeleteMode,
} from '../../../../../state/clients/clientsSlice';

export default function ClientListHeaderLeft() {
  const dispatch = useDispatch();
  const deleteMode = useSelector(selectDeleteMode);

  const handleCancel = () => {
    dispatch(setDeleteMode(false));
    // No need to clear clientsDeleteSet anymore - setDeleteMode(false) handles clearing selections
  };

  return (
    <TouchableOpacity
      className="w-20"
      onPress={() => {
        if (deleteMode) {
          handleCancel();
        } else {
          dispatch(setDeleteMode(true));
        }
      }}
      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
    >
      <Text className="text-2xl font-hn-medium text-blue-500 underline">
        {deleteMode ? 'Cancel' : 'Edit'}
      </Text>
    </TouchableOpacity>
  );
}
