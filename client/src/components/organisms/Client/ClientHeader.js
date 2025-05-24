import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { clientsFilteredByAction } from '../../../sagas/clients/clientsFilteredBy/action';
import { clientsSearchByAction } from '../../../sagas/clients/clientsSearchBy/action';
import { clientsSortedByAction } from '../../../sagas/clients/clientsSortedBy/action';
import { clientsSortedDirectionAction } from '../../../sagas/clients/clientsSortedDirection/action';
import { processSearchedResultSetAction } from '../../../sagas/clients/processSearchedResultSet/action';
import {
  selectSortedDirection,
  selectSortedBy,
  selectFilteredBy,
} from '../../../state/clients/clientsSlice';
import ClientSearch from '../../molecules/Client/ClientSearch';

export default function ClientHeader() {
  const dispatch = useDispatch();

  const filteredBy = useSelector(selectFilteredBy);
  const sortedDirection = useSelector(selectSortedDirection);
  const sortedBy = useSelector(selectSortedBy);

  const [sortDir, setSortDirection] = useState(sortedDirection);
  const [searchStr, setSearchStr] = useState('');

  const handleSelectFilterBy = (filter) => {
    dispatch(clientsFilteredByAction(filter));
    if (searchStr) {
      dispatch(processSearchedResultSetAction(searchStr));
    }
  };

  const handleOrderBy = (order) => {
    dispatch(clientsSortedByAction(order));
    if (searchStr) {
      dispatch(processSearchedResultSetAction(searchStr));
    }
  };

  const handleSortDirection = () => {
    if (sortDir === 'asc') {
      setSortDirection('desc');
      dispatch(clientsSortedDirectionAction('desc'));
    } else {
      setSortDirection('asc');
      dispatch(clientsSortedDirectionAction('asc'));
    }
    if (searchStr) {
      dispatch(processSearchedResultSetAction(searchStr));
    }
  };

  const handleClientSearch = (e) => {
    dispatch(clientsSearchByAction(e));
    setSearchStr(e);
    dispatch(processSearchedResultSetAction(e));
  };

  return (
    <View className="flex-row items-center justify-between bg-white p-4">
      {/* Search Bar */}
      <View className="flex-1 flex-row items-center rounded px-2 py-1 mr-2">
        <ClientSearch
          searchStr={searchStr}
          handleClientSearch={handleClientSearch}
        />
      </View>

      {/* Sort By Dropdown */}
      <TouchableOpacity
        className="ml-2 px-2 py-1 bg-blue-100 rounded"
        onPress={() => handleOrderBy(sortedBy === 'fname' ? 'lname' : 'fname')}
      >
        <Text className="text-blue-700">
          {sortedBy === 'fname' ? 'Last Name' : 'First Name'}
        </Text>
      </TouchableOpacity>

      {/* Sort Direction Toggle */}
      <TouchableOpacity
        className="ml-2 px-2 py-1 bg-blue-100 rounded"
        onPress={handleSortDirection}
      >
        {sortDir === 'asc' ? (
          <ArrowUpAZ size={20} color="#2563eb" />
        ) : (
          <ArrowDownAZ size={20} color="#2563eb" />
        )}
      </TouchableOpacity>

      {/* Filter By Dropdown */}
      <TouchableOpacity
        className="ml-2 px-2 py-1 bg-blue-100 rounded"
        onPress={() =>
          handleSelectFilterBy(filteredBy === 'all' ? 'favorites' : 'all')
        }
      >
        <Text className="text-blue-700">
          {filteredBy === 'all' ? 'Favorites' : 'All'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
