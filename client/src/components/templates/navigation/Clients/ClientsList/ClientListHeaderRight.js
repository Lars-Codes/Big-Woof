import { UserRoundPlus } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setClientDetails } from '../../../../../state/clientDetails/clientDetailsSlice';
import {
  selectClients,
  selectDeleteMode,
} from '../../../../../state/clients/clientsSlice';

export default function ClientListHeaderRight({ navigation }) {
  const dispatch = useDispatch();
  const deleteMode = useSelector(selectDeleteMode);
  const clients = useSelector(selectClients);
  const clientCount = clients.length;

  const handleClick = () => {
    // set client details to null
    dispatch(setClientDetails(null));
    navigation.navigate('ClientForm');
  };

  return !deleteMode ? (
    <TouchableOpacity
      className="w-24 flex-row justify-end"
      onPress={() => handleClick()}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <UserRoundPlus size={28} color="#000" />
    </TouchableOpacity>
  ) : (
    <Text className="text-2xl font-hn-medium text-black">
      {clientCount} Clients
    </Text>
  );
}
