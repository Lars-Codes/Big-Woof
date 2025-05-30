import { UserRoundPlus } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { selectDeleteMode } from '../../../../../state/clients/clientsSlice';

export default function ClientListHeaderRight({ navigation }) {
  const deleteMode = useSelector(selectDeleteMode);
  return (
    !deleteMode && (
      <TouchableOpacity
        onPress={() => navigation.navigate('ClientForm', { client: null })}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <UserRoundPlus size={28} color="#000" />
      </TouchableOpacity>
    )
  );
}
