import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as ClientSlice from '../../../../../state/clients/clientsSlice';
import { selectListType } from '../../../../../state/list/listSlice';
import * as PetsSlice from '../../../../../state/pets/petsSlice';

export default function ListHeaderLeft() {
  const dispatch = useDispatch();
  const listType = useSelector(selectListType);
  const clientDeleteMode = useSelector(ClientSlice.selectDeleteMode);
  const petDeleteMode = useSelector(PetsSlice.selectDeleteMode);
  const deleteMode = clientDeleteMode || petDeleteMode;

  const handleCancel = () => {
    // Cancel both delete modes
    dispatch(ClientSlice.setDeleteMode(false));
    dispatch(PetsSlice.setDeleteMode(false));
  };

  const handleEdit = () => {
    if (listType === 'Clients') {
      dispatch(ClientSlice.setDeleteMode(true));
    } else {
      dispatch(PetsSlice.setDeleteMode(true));
    }
  };

  return (
    <TouchableOpacity
      className="w-20"
      onPress={() => {
        if (deleteMode) {
          handleCancel();
        } else {
          handleEdit();
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
