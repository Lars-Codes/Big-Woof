import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  ChevronLeft,
  CircleCheckBig,
  CircleEllipsis,
  CirclePlus,
  Trash2,
  X,
  ListPlus,
  ListX,
} from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, Alert, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteClientAction } from '../../../../sagas/clients/deleteClient/action';
import { selectClientDetails } from '../../../../state/clientDetails/clientDetailsSlice';
import {
  selectDeleteMode,
  setDeleteMode,
  selectClientsDeleteSet,
  setClientsDeleteSet,
  selectClients,
  setCloseAllRows,
} from '../../../../state/clients/clientsSlice';
import ClientDetails from '../../../pages/Clients/ClientDetails';
import Clients from '../../../pages/Clients/Clients';
import ClientForm from '../../forms/Client/ClientForm';

const Stack = createNativeStackNavigator();

export default function ClientsNavigator() {
  const dispatch = useDispatch();
  const clients = useSelector(selectClients);
  const client = useSelector(selectClientDetails);
  const deleteMode = useSelector(selectDeleteMode);
  const clientsDeleteSet = useSelector(selectClientsDeleteSet);

  const handleDeleteMode = () => {
    if (deleteMode) {
      if (clientsDeleteSet.length > 0) {
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
                handleConfirm();
              },
              style: 'destructive',
            },
          ],
        );
      } else {
        handleCancel();
      }
    } else {
      dispatch(setDeleteMode(true));
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

  const handleConfirm = () => {
    dispatch(setCloseAllRows(true));
    setTimeout(() => {
      dispatch(deleteClientAction(clientsDeleteSet));
      dispatch(setDeleteMode(false));
      dispatch(setClientsDeleteSet([]));
      dispatch(setCloseAllRows(false));
    }, 350);
  };

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        animation: 'slide_from_right',
        headerLeft: () =>
          navigation.canGoBack() ? (
            <TouchableOpacity
              className="mr-2"
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ChevronLeft size={32} color="#000" />
            </TouchableOpacity>
          ) : null,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: 'white',
        },
        headerTitleAlign: 'left',
        headerBackTitleVisible: false,
      })}
    >
      <Stack.Screen
        name="ClientsList"
        component={Clients}
        options={({ navigation }) => ({
          headerTitle: () => (
            <Text className="text-3xl font-hn-bold">Clients</Text>
          ),
          headerLeft: () => (
            <TouchableOpacity
              className="mr-2"
              onPress={() => {
                if (deleteMode) {
                  if (clientsDeleteSet.length !== clients.length) {
                    dispatch(
                      setClientsDeleteSet(clients.map((c) => c.client_id)),
                    );
                  } else {
                    dispatch(setClientsDeleteSet([]));
                  }
                } else {
                  navigation.navigate('ClientForm', { client: {} });
                }
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {deleteMode ? (
                clientsDeleteSet.length != clients.length ? (
                  <ListPlus size={32} color="#000" />
                ) : (
                  <ListX size={32} color="#000" />
                )
              ) : (
                <CirclePlus size={32} color="#000" />
              )}
            </TouchableOpacity>
          ),
          headerRight: () =>
            clients.length > 0 ? (
              <View className="flex-row-reverse items-center">
                <TouchableOpacity
                  className="ml-2"
                  onPress={handleDeleteMode}
                  disabled={deleteMode && clientsDeleteSet.length === 0}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {deleteMode ? (
                    <CircleCheckBig
                      size={32}
                      color="#000"
                      style={{
                        opacity: clientsDeleteSet.length === 0 ? 0.5 : 1,
                      }}
                    />
                  ) : (
                    <Trash2 size={32} color="#000" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  className="ml-2"
                  onPress={handleCancel}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={{
                    opacity: deleteMode ? 1 : 0,
                    pointerEvents: deleteMode ? 'auto' : 'none',
                  }}
                >
                  <X size={32} color="#000" />
                </TouchableOpacity>
              </View>
            ) : null,
          gestureEnabled: false, // Prevent swipe back
        })}
      />
      <Stack.Screen
        name="ClientDetails"
        component={ClientDetails}
        options={({ navigation }) => ({
          headerTitle: () => (
            <Text className="text-3xl font-hn-bold">Client Details</Text>
          ),
          headerRight: () => (
            <TouchableOpacity
              className="mr-2"
              // onPress={() => native drop down menu; for right now, just navigate to client form with the selected client
              onPress={() =>
                navigation.navigate('ClientForm', { client: client })
              }
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <CircleEllipsis size={32} color="#000" />
            </TouchableOpacity>
          ),
          gestureEnabled: false, // Prevent swipe back
        })}
      />
      <Stack.Screen
        name="ClientForm"
        component={ClientForm}
        options={() => ({
          headerTitle: () => (
            <Text className="text-3xl font-hn-bold">Client Form</Text>
          ),
          gestureEnabled: false,
        })}
      />
    </Stack.Navigator>
  );
}
