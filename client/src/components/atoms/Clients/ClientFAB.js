import {
  EllipsisVertical,
  UserPlus,
  Trash2,
  ListPlus,
  ListX,
  Check,
  X,
} from 'lucide-react-native';
import React from 'react';
import { Alert } from 'react-native';
import { FloatingAction } from 'react-native-floating-action';
import { useDispatch, useSelector } from 'react-redux';
import { deleteClientAction } from '../../../sagas/clients/deleteClient/action';
import {
  selectDeleteMode,
  selectClientsDeleteSet,
  selectClients,
  setDeleteMode,
  setCloseAllRows,
  setClientsDeleteSet,
} from '../../../state/clients/clientsSlice';

export default function ClientFAB({ onAddClient }) {
  const dispatch = useDispatch();

  const deleteMode = useSelector(selectDeleteMode);
  const clientsDeleteSet = useSelector(selectClientsDeleteSet);
  const clients = useSelector(selectClients);

  const handleDeleteMode = () => {
    dispatch(setDeleteMode(true));
  };

  const handleSelectAll = () => {
    if (clientsDeleteSet.length !== clients.length) {
      dispatch(setClientsDeleteSet(clients.map((c) => c.client_id)));
    } else {
      dispatch(setClientsDeleteSet([]));
    }
  };

  const handleCancel = () => {
    dispatch(setCloseAllRows(true));
    setTimeout(() => {
      dispatch(setDeleteMode(false));
      dispatch(setClientsDeleteSet([]));
      dispatch(setCloseAllRows(false));
    }, 350);
  };

  const handleConfirmDelete = () => {
    if (clientsDeleteSet.length === 0) {
      handleCancel();
      return;
    }

    Alert.alert(
      'Delete Selected Clients',
      `Are you sure you want to delete ${clientsDeleteSet.length} selected client${clientsDeleteSet.length > 1 ? 's' : ''}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            dispatch(setCloseAllRows(true));
            setTimeout(() => {
              dispatch(deleteClientAction(clientsDeleteSet));
              dispatch(setDeleteMode(false));
              dispatch(setClientsDeleteSet([]));
              dispatch(setCloseAllRows(false));
            }, 350);
          },
          style: 'destructive',
        },
      ],
    );
  };

  const actionTextStyle = {
    fontFamily: 'font-hn-regular',
    fontSize: 16,
    textAlignVertical: 'center',
  };

  const actionTextContainerStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  };

  const normalActions = [
    {
      text: 'Delete Mode',
      icon: <Trash2 size={22} color="#fff" />,
      name: 'bt_delete_mode',
      position: 1,
      textStyle: actionTextStyle,
      textContainerStyle: actionTextContainerStyle,
    },
    {
      text: 'Add Client',
      icon: <UserPlus size={22} color="#fff" />,
      name: 'bt_add_client',
      position: 2,
      textStyle: actionTextStyle,
      textContainerStyle: actionTextContainerStyle,
    },
  ];

  const deleteActions = [
    {
      text:
        clientsDeleteSet.length !== clients.length
          ? 'Select All'
          : 'Deselect All',
      icon:
        clientsDeleteSet.length !== clients.length ? (
          <ListPlus size={22} color="#fff" />
        ) : (
          <ListX size={22} color="#fff" />
        ),
      name: 'bt_select_toggle',
      position: 1,
      textStyle: actionTextStyle,
      textContainerStyle: actionTextContainerStyle,
    },
    {
      text: 'Cancel',
      icon: <X size={22} color="#fff" />,
      name: 'bt_cancel',
      position: 2,
      textStyle: actionTextStyle,
      textContainerStyle: actionTextContainerStyle,
    },
    {
      text: `Delete (${clientsDeleteSet.length})`,
      icon: <Check size={22} color="#fff" />,
      name: 'bt_confirm_delete',
      position: 3,
      textStyle: actionTextStyle,
      textContainerStyle: actionTextContainerStyle,
      color: clientsDeleteSet.length > 0 ? '#FF3B30' : '#999',
    },
  ];

  const handleActionPress = (name) => {
    switch (name) {
      case 'bt_add_client':
        onAddClient?.();
        break;
      case 'bt_delete_mode':
        handleDeleteMode();
        break;
      case 'bt_select_toggle':
        handleSelectAll();
        break;
      case 'bt_cancel':
        handleCancel();
        break;
      case 'bt_confirm_delete':
        handleConfirmDelete();
        break;
      default:
    }
  };

  return (
    <FloatingAction
      actions={deleteMode ? deleteActions : normalActions}
      color={deleteMode ? '#FF3B30' : '#4A90E2'}
      floatingIcon={
        deleteMode ? (
          <Trash2 size={22} color="#fff" />
        ) : (
          <EllipsisVertical size={22} color="#fff" />
        )
      }
      onPressItem={handleActionPress}
      overlayColor="rgba(0, 0, 0, 0.5)"
      buttonSize={56}
      actionsPaddingTopBottom={8}
    />
  );
}
