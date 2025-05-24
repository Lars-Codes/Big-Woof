import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  selectClientsResultSet,
  selectSearchedResultSet,
  selectSearchBy,
} from '../../../state/clients/clientsSlice';
import ClientHeader from '../../organisms/Client/ClientHeader';
import ClientList from '../../organisms/Client/ClientList';

export default function Clients() {
  const clientsResultSet = useSelector(selectClientsResultSet);
  const searchedResultsSet = useSelector(selectSearchedResultSet);
  const searchBy = useSelector(selectSearchBy);

  const clients =
    searchBy && searchBy.length > 0 ? searchedResultsSet : clientsResultSet;

  return (
    <View className="flex-1">
      <ClientHeader />
      <ClientList clients={clients} />
    </View>
  );
}
