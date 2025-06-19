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
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text className="text-2xl font-hn-medium text-blue-500">
        {deleteMode ? 'Cancel' : 'Edit'}
      </Text>
    </TouchableOpacity>
  );
}
