/* eslint-disable no-unused-vars */
import React from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { clientsFilteredByAction } from '../../../sagas/clients/clientsFilteredBy/action';
import { clientsSearchByAction } from '../../../sagas/clients/clientsSearchBy/action';
import { clientsSortedByAction } from '../../../sagas/clients/clientsSortedBy/action';
import { clientsSortedDirection } from '../../../sagas/clients/clientsSortedDirection/action';
import { processSearchedResultSetAction } from '../../../sagas/clients/processSearchedResultSet/action';
import {
  selectLoading,
  selectClientsResultSet,
  selectSearchedResultSet,
  selectSearchBy,
  selectFilteredBy,
  selectSortedBy,
  selectSortedDirection,
} from '../../../state/clients/clientsSlice';
import ClientList from '../../organisms/Client/ClientList';

export default function Clients() {
  const dispatch = useDispatch();

  // Redux state selectors
  const loading = useSelector(selectLoading);
  const clientsResultSet = useSelector(selectClientsResultSet);
  const searchedResultsSet = useSelector(selectSearchedResultSet);
  const searchBy = useSelector(selectSearchBy);
  const filteredBy = useSelector(selectFilteredBy);
  const sortedBy = useSelector(selectSortedBy);
  const sortedDirection = useSelector(selectSortedDirection);

  const clients =
    searchBy && searchBy.length > 0 ? searchedResultsSet : clientsResultSet;

  return (
    <View className="flex-1">
      <ClientList clients={clients} />
    </View>
  );
}
